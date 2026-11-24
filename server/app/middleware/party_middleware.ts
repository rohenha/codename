import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Party from '#models/party'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class PartyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = await ctx.auth.getUserOrFail()
    const party = await Party.query()
      .where('uuid', ctx.params.partyId)
      .preload('users')
      .preload('admin')
      .preload('teams')
      .firstOrFail()

    ctx.party = party
    ctx.user = user
    return next()
  }
}
