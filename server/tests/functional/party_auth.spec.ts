import { test } from '@japa/runner'
import type { ApiClient } from '@japa/api-client'
import testUtils from '@adonisjs/core/services/test_utils'
import PartyUsers from '#models/party_users'

type CreatedParty = {
  party: {
    uuid: string
    adminUuid: string
  }
  partyUser: {
    uuid: string
    partyUuid: string
    plainToken: string
    parties: Array<{ uuid: string }>
  }
}

async function createParty(client: ApiClient, name: string, username: string) {
  const response = await client.post('/api/party').json({
    name,
    username,
    themes: ['cinema'],
  })

  response.assertStatus(200)
  return response.body() as CreatedParty
}

test.group('Party auth', (group) => {
  group.setup(() => testUtils.db().withGlobalTransaction())

  test('store returns a session token and stores only its hash', async ({ client, assert }) => {
    const { party, partyUser } = await createParty(client, 'My party', 'admin')

    assert.isString(partyUser.plainToken)
    assert.equal(party.adminUuid, partyUser.uuid)
    assert.isArray(partyUser.parties)
    assert.lengthOf(partyUser.parties, 1)
    assert.equal(partyUser.parties[0].uuid, party.uuid)

    const storedUser = await PartyUsers.findOrFail(partyUser.uuid)
    assert.equal(storedUser.token, PartyUsers.hashToken(partyUser.plainToken))
    assert.notEqual(storedUser.token, partyUser.plainToken)
  })

  test('addUser returns a session token for the new player', async ({ client, assert }) => {
    const { party } = await createParty(client, 'My party', 'admin')

    const response = await client.post(`/api/party/${party.uuid}/add-user`).json({
      username: 'player',
    })

    response.assertStatus(200)
    const body = response.body() as { partyUser: CreatedParty['partyUser'] }

    assert.isString(body.partyUser.plainToken)
    assert.equal(body.partyUser.partyUuid, party.uuid)
    assert.isArray(body.partyUser.parties)
    assert.lengthOf(body.partyUser.parties, 1)
    assert.equal(body.partyUser.parties[0].uuid, party.uuid)

    const storedUser = await PartyUsers.findOrFail(body.partyUser.uuid)
    assert.equal(storedUser.token, PartyUsers.hashToken(body.partyUser.plainToken))
  })

  test('addUser returns a 404 for an unknown party', async ({ client }) => {
    const response = await client
      .post('/api/party/00000000-0000-0000-0000-000000000000/add-user')
      .json({ username: 'player' })

    response.assertStatus(404)
  })

  test('me rejects a request without token', async ({ client }) => {
    const response = await client.get('/api/me').header('accept', 'application/json')

    response.assertStatus(401)
  })

  test('me rejects an unknown token', async ({ client }) => {
    const response = await client
      .get('/api/me')
      .header('x-player-token', 'not-a-real-token')
      .header('accept', 'application/json')

    response.assertStatus(401)
  })

  test('me returns the current player and party', async ({ client, assert }) => {
    const { party, partyUser } = await createParty(client, 'My party', 'admin')

    const response = await client.get('/api/me').header('x-player-token', partyUser.plainToken)
    response.assertStatus(200)

    const body = response.body() as {
      uuid: string
      username: string
      parties: Array<{ uuid: string }>
    }

    assert.equal(body.uuid, partyUser.uuid)
    assert.equal(body.username, 'admin')
    assert.isArray(body.parties)
    assert.lengthOf(body.parties, 1)
    assert.equal(body.parties[0].uuid, party.uuid)
  })

  test('me accepts a bearer token', async ({ client }) => {
    const { partyUser } = await createParty(client, 'My party', 'admin')

    const response = await client
      .get('/api/me')
      .header('authorization', `Bearer ${partyUser.plainToken}`)

    response.assertStatus(200)
  })

  test('party routes reject a token from another party', async ({ client }) => {
    const partyA = await createParty(client, 'Party A', 'admin-a')
    const partyB = await createParty(client, 'Party B', 'admin-b')

    const response = await client
      .get(`/api/party/${partyB.party.uuid}/round`)
      .header('x-player-token', partyA.partyUser.plainToken)
      .header('accept', 'application/json')

    response.assertStatus(403)
  })

  test('party routes accept a token from the right party', async ({ client }) => {
    const { party, partyUser } = await createParty(client, 'My party', 'admin')

    const response = await client
      .get(`/api/party/${party.uuid}/round`)
      .header('x-player-token', partyUser.plainToken)

    response.assertStatus(200)
  })

  test('the public party route works without token and never exposes hashes', async ({
    client,
    assert,
  }) => {
    const { party } = await createParty(client, 'My party', 'admin')

    const response = await client.get(`/api/party/${party.uuid}`)
    response.assertStatus(200)

    const body = response.body() as {
      users: Array<Record<string, unknown>>
    }

    assert.isArray(body.users)
    assert.notProperty(body.users[0], 'token')
    assert.notProperty(body.users[0], 'plainToken')
  })
})
