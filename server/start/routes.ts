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

router.get('/', async () => ({ name: 'codename-api' }))

router.get('/api/health', async () => ({ status: 'ok' }))

router.get('/api/themes/options', [controllers.Themes, 'options'])
router.get('/api/party/round', [controllers.Parties, 'roundGeneration'])
