/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('options', [controllers.Themes, 'options'])
      })
      .prefix('themes')
      .as('themes')

    router
      .group(() => {
        router.post('', [controllers.Parties, 'store'])
        router.get(':partyId', [controllers.Parties, 'show'])
      })
      .prefix('party')
      .as('party')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.get('parties', [controllers.Profile, 'parties'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
