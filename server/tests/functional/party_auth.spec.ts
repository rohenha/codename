import { test } from '@japa/runner'
import type { ApiClient } from '@japa/api-client'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import PartyUsers from '#models/party_users'
import { ACCESS_COOKIE, REFRESH_COOKIE } from '#services/party_session'

type CreatedParty = {
  party: {
    uuid: string
    adminUuid: string
  }
  partyUser: {
    uuid: string
    username: string
    parties: Array<{ uuid: string }>
  }
}

type SessionResponse = {
  body: CreatedParty
  accessToken: string
  refreshToken: string
}

async function createParty(
  client: ApiClient,
  name: string,
  username: string
): Promise<SessionResponse> {
  const response = await client.post('/api/party').json({
    name,
    username,
    themes: ['cinema'],
  })

  response.assertStatus(200)

  return {
    body: response.body() as CreatedParty,
    accessToken: response.cookie(ACCESS_COOKIE)!.value,
    refreshToken: response.cookie(REFRESH_COOKIE)!.value,
  }
}

test.group('Party auth', (group) => {
  group.setup(() => testUtils.db().withGlobalTransaction())

  test('store returns HttpOnly cookies and stores only their hashes', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/api/party').json({
      name: 'My party',
      username: 'admin',
      themes: ['cinema'],
    })

    response.assertStatus(200)

    const body = response.body() as CreatedParty
    const access = response.cookie(ACCESS_COOKIE)
    const refresh = response.cookie(REFRESH_COOKIE)

    assert.isDefined(access)
    assert.isDefined(refresh)
    assert.isTrue(access!.httpOnly)
    assert.isTrue(refresh!.httpOnly)
    assert.equal(access!.path, '/')
    assert.equal(refresh!.path, '/api/auth')
    assert.notProperty(body.partyUser, 'plainToken')
    assert.notProperty(body.partyUser, 'token')
    assert.notProperty(body.partyUser, 'refreshToken')
    assert.equal(body.party.adminUuid, body.partyUser.uuid)
    assert.isArray(body.partyUser.parties)
    assert.lengthOf(body.partyUser.parties, 1)
    assert.equal(body.partyUser.parties[0].uuid, body.party.uuid)

    const storedUser = await PartyUsers.findOrFail(body.partyUser.uuid)
    assert.equal(storedUser.token, PartyUsers.hashToken(access!.value))
    assert.notEqual(storedUser.token, access!.value)
    assert.equal(storedUser.refreshToken, PartyUsers.hashToken(refresh!.value))
  })

  test('store reuses the authenticated player instead of creating a new one', async ({
    client,
    assert,
  }) => {
    const first = await createParty(client, 'Party A', 'admin')

    const response = await client
      .post('/api/party')
      .plainCookie(ACCESS_COOKIE, first.accessToken)
      .json({
        name: 'Party B',
        username: 'ignored',
        themes: ['sport'],
      })

    response.assertStatus(200)

    const body = response.body() as CreatedParty
    const access = response.cookie(ACCESS_COOKIE)!.value

    assert.equal(body.partyUser.uuid, first.body.partyUser.uuid)
    assert.equal(body.partyUser.username, 'admin')
    assert.equal(body.party.adminUuid, first.body.partyUser.uuid)
    assert.lengthOf(body.partyUser.parties, 2)
    assert.includeMembers(
      body.partyUser.parties.map((party) => party.uuid),
      [first.body.party.uuid, body.party.uuid]
    )
    assert.isNull(await PartyUsers.query().where('username', 'ignored').first())

    const me = await client.get('/api/me').plainCookie(ACCESS_COOKIE, access)
    me.assertStatus(200)

    const meBody = me.body() as { parties: Array<{ uuid: string }> }
    assert.lengthOf(meBody.parties, 2)
    assert.includeMembers(
      meBody.parties.map((party) => party.uuid),
      [first.body.party.uuid, body.party.uuid]
    )
  })

  test('store asks for a refresh when the access cookie is expired', async ({
    client,
    assert,
  }) => {
    const first = await createParty(client, 'Party A', 'admin')
    const storedUser = await PartyUsers.findOrFail(first.body.partyUser.uuid)
    storedUser.tokenExpiresAt = DateTime.now().minus({ minutes: 1 })
    await storedUser.save()

    const response = await client
      .post('/api/party')
      .plainCookie(ACCESS_COOKIE, first.accessToken)
      .plainCookie(REFRESH_COOKIE, first.refreshToken)
      .json({
        name: 'Party B',
        username: 'ignored',
        themes: ['sport'],
      })

    response.assertStatus(401)
    assert.isNull(await PartyUsers.query().where('username', 'ignored').first())
  })

  test('addUser returns a session for the new player', async ({ client, assert }) => {
    const { body: admin } = await createParty(client, 'My party', 'admin')

    const response = await client.post(`/api/party/${admin.party.uuid}/add-user`).json({
      username: 'player',
    })

    response.assertStatus(200)
    const body = response.body() as { partyUser: CreatedParty['partyUser'] }
    const access = response.cookie(ACCESS_COOKIE)

    assert.isDefined(access)
    assert.isArray(body.partyUser.parties)
    assert.lengthOf(body.partyUser.parties, 1)
    assert.equal(body.partyUser.parties[0].uuid, admin.party.uuid)

    const storedUser = await PartyUsers.findOrFail(body.partyUser.uuid)
    assert.equal(storedUser.token, PartyUsers.hashToken(access!.value))
  })

  test('addUser reuses the authenticated player when joining another party', async ({
    client,
    assert,
  }) => {
    const first = await createParty(client, 'Party A', 'admin')
    const second = await createParty(client, 'Party B', 'admin-b')

    const response = await client
      .post(`/api/party/${second.body.party.uuid}/add-user`)
      .plainCookie(ACCESS_COOKIE, first.accessToken)
      .json({ username: 'ignored' })

    response.assertStatus(200)

    const body = response.body() as { partyUser: CreatedParty['partyUser'] }

    assert.equal(body.partyUser.uuid, first.body.partyUser.uuid)
    assert.equal(body.partyUser.username, 'admin')
    assert.lengthOf(body.partyUser.parties, 2)
    assert.includeMembers(
      body.partyUser.parties.map((party) => party.uuid),
      [first.body.party.uuid, second.body.party.uuid]
    )
    assert.isNull(await PartyUsers.query().where('username', 'ignored').first())
  })

  test('addUser returns a 404 for an unknown party', async ({ client }) => {
    const response = await client
      .post('/api/party/00000000-0000-0000-0000-000000000000/add-user')
      .json({ username: 'player' })

    response.assertStatus(404)
  })

  test('me rejects a request without an access cookie', async ({ client }) => {
    const response = await client.get('/api/me').header('accept', 'application/json')

    response.assertStatus(401)
  })

  test('me rejects an unknown access cookie', async ({ client }) => {
    const response = await client
      .get('/api/me')
      .plainCookie(ACCESS_COOKIE, 'not-a-real-token')
      .header('accept', 'application/json')

    response.assertStatus(401)
  })

  test('me returns the current player and party', async ({ client, assert }) => {
    const { body, accessToken } = await createParty(client, 'My party', 'admin')

    const response = await client.get('/api/me').plainCookie(ACCESS_COOKIE, accessToken)
    response.assertStatus(200)

    const me = response.body() as {
      uuid: string
      username: string
      parties: Array<{ uuid: string }>
    }

    assert.equal(me.uuid, body.partyUser.uuid)
    assert.equal(me.username, 'admin')
    assert.isArray(me.parties)
    assert.lengthOf(me.parties, 1)
    assert.equal(me.parties[0].uuid, body.party.uuid)
  })

  test('refresh rotates both cookies and invalidates the previous access token', async ({
    client,
    assert,
  }) => {
    const { accessToken, refreshToken } = await createParty(client, 'My party', 'admin')

    const response = await client
      .post('/api/auth/refresh')
      .plainCookie(REFRESH_COOKIE, refreshToken)
    response.assertStatus(200)

    const newAccess = response.cookie(ACCESS_COOKIE)!.value
    const newRefresh = response.cookie(REFRESH_COOKIE)!.value

    assert.notEqual(newAccess, accessToken)
    assert.notEqual(newRefresh, refreshToken)

    const refreshed = await client.get('/api/me').plainCookie(ACCESS_COOKIE, newAccess)
    refreshed.assertStatus(200)

    const stale = await client
      .get('/api/me')
      .plainCookie(ACCESS_COOKIE, accessToken)
      .header('accept', 'application/json')
    stale.assertStatus(401)

    const reusedRefresh = await client
      .post('/api/auth/refresh')
      .plainCookie(REFRESH_COOKIE, refreshToken)
      .header('accept', 'application/json')
    reusedRefresh.assertStatus(401)
  })

  test('an expired access token is rejected', async ({ client }) => {
    const { body, accessToken } = await createParty(client, 'My party', 'admin')
    const storedUser = await PartyUsers.findOrFail(body.partyUser.uuid)
    storedUser.tokenExpiresAt = DateTime.now().minus({ minutes: 1 })
    await storedUser.save()

    const response = await client
      .get('/api/me')
      .plainCookie(ACCESS_COOKIE, accessToken)
      .header('accept', 'application/json')

    response.assertStatus(401)
  })

  test('logout clears the session and invalidates both tokens', async ({ client }) => {
    const { accessToken, refreshToken } = await createParty(client, 'My party', 'admin')

    const response = await client.post('/api/auth/logout').plainCookie(REFRESH_COOKIE, refreshToken)
    response.assertStatus(200)

    const me = await client
      .get('/api/me')
      .plainCookie(ACCESS_COOKIE, accessToken)
      .header('accept', 'application/json')
    me.assertStatus(401)

    const refresh = await client
      .post('/api/auth/refresh')
      .plainCookie(REFRESH_COOKIE, refreshToken)
      .header('accept', 'application/json')
    refresh.assertStatus(401)
  })

  test('party routes reject a session from another party', async ({ client }) => {
    const partyA = await createParty(client, 'Party A', 'admin-a')
    const partyB = await createParty(client, 'Party B', 'admin-b')

    const response = await client
      .get(`/api/party/${partyB.body.party.uuid}/round`)
      .plainCookie(ACCESS_COOKIE, partyA.accessToken)
      .header('accept', 'application/json')

    response.assertStatus(403)
  })

  test('party routes accept a session from the right party', async ({ client }) => {
    const { body, accessToken } = await createParty(client, 'My party', 'admin')

    const response = await client
      .get(`/api/party/${body.party.uuid}/round`)
      .plainCookie(ACCESS_COOKIE, accessToken)

    response.assertStatus(200)
  })

  test('the public party route works without a session and never exposes secrets', async ({
    client,
    assert,
  }) => {
    const { body } = await createParty(client, 'My party', 'admin')

    const response = await client.get(`/api/party/${body.party.uuid}`)
    response.assertStatus(200)

    const party = response.body() as {
      users: Array<Record<string, unknown>>
    }

    assert.isArray(party.users)
    assert.notProperty(party.users[0], 'token')
    assert.notProperty(party.users[0], 'plainToken')
    assert.notProperty(party.users[0], 'refreshToken')
    assert.notProperty(party.users[0], 'tokenExpiresAt')
    assert.notProperty(party.users[0], 'refreshTokenExpiresAt')
  })
})
