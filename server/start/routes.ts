/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => ({ name: 'codename-api' }))

router.get('/api/health', async () => ({ status: 'ok' }))
