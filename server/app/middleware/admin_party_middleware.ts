import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AdminPartyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.user
    const party = ctx.party

    if (party.adminId !== user.id) {
      return ctx.response.status(403).json({
        error: {
          code: 'ADMIN_PARTY_ACCESS_DENIED',
          message: 'You are not allowed to access here',
        },
      })
    }

    return next()
  }
}
