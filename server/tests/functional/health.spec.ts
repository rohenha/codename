import { test } from '@japa/runner'

test('health endpoint returns JSON', async ({ client }) => {
  const response = await client.get('/api/health')

  response.assertStatus(200)
  response.assertBody({ status: 'ok' })
  response.assertHeader('content-type', 'application/json; charset=utf-8')
})

test('unknown API endpoints return not found', async ({ client }) => {
  const response = await client.get('/api/not-found').header('accept', 'application/json')

  response.assertStatus(404)
})
