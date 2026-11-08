/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.get('/', async () => ({ name: 'codename-api' }))

router.get('/api/health', async () => ({ status: 'ok' }))

router.get('/api/themes/options', [controllers.Themes, 'options'])
router.post('/api/auth/refresh', [controllers.PartyUsers, 'refresh'])
router.post('/api/auth/logout', [controllers.PartyUsers, 'logout'])
router.post('/api/party', [controllers.Parties, 'store'])
router.get('/api/party/:partyId', [controllers.Parties, 'find'])
router.post('/api/party/:partyId/add-user', [controllers.Parties, 'addUser'])

/**
 * Routes requiring an authenticated party player.
 */
router.get('/api/me', [controllers.PartyUsers, 'me']).use(middleware.partyAuth())
router
  .get('/api/party/:partyId/round', [controllers.Parties, 'roundGeneration'])
  .use(middleware.partyAuth())
  .as('parties.party_round_generation')
