import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Parties from '#models/parties'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class PartyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = await ctx.auth.getUserOrFail()
    const party = await Parties.query()
      .where('uuid', ctx.params.partyId)
      .preload('users')
      .firstOrFail()

    const existsUserInParty = party.users.find((partyUser) => user.id === partyUser.id)

    if (!existsUserInParty) {
      return ctx.response.status(403).json({
        error: {
          code: 'PARTY_ACCESS_DENIED',
          message: 'You are not allowed to access to this party',
        },
      })
    }

    ctx.party = party
    ctx.user = user
    return next()
  }
}
