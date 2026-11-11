import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Parties from '#models/parties'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AdminPartyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = await ctx.auth.getUserOrFail()
    const party = await Parties.query()
      .where('uuid', ctx.params.partyId)
      .preload('users')
      .firstOrFail()

    if (party.adminId !== user.id) {
      return ctx.response.status(403).json({
        error: {
          code: 'ADMIN_PARTY_ACCESS_DENIED',
          message: 'You are not allowed to access here',
        },
      })
    }

    ctx.party = party
    ctx.user = user
    return next()
  }
}
