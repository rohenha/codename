import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class PartyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const party = ctx.party
    const user = ctx.user

    const existsUserInParty = party.users.find((partyUser) => user.id === partyUser.id)

    if (!existsUserInParty) {
      return ctx.response.status(403).json({
        error: {
          code: 'PARTY_ACCESS_DENIED',
          message: 'You are not allowed to access to this party',
        },
      })
    }

    return next()
  }
}
