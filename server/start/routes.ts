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
import transmit from '@adonisjs/transmit/services/main'

// Transmit routes
transmit.registerRoutes((route) => {
  route.middleware(middleware.auth())
})

router.get('/', () => {
  return { name: 'Codename api' }
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
        router.post('', [controllers.Party, 'store'])
        router
          .group(() => {
            router.get('join', [controllers.Party, 'join'])
            router.post('add-user', [controllers.Party, 'addUser'])
            router
              .group(() => {
                router.get('', [controllers.Party, 'show'])
                router
                  .post('remove-user', [controllers.Party, 'removeUser'])
                  .use(middleware.adminParty())
                router
                  .post('init-party', [controllers.Party, 'initParty'])
                  .use(middleware.adminParty())
                router.get('teams', [controllers.Party, 'getTeams'])
              })
              .use(middleware.userParty())
          })
          .prefix(':partyId')
          .use(middleware.party())
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
