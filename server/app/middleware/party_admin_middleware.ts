import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Allows only the admin of the current party.
 *
 * Must be used after the partyAuth middleware.
 */
export default class PartyAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const partyUser = ctx.partyUser
    const partyId = ctx.params.partyId
    const party = partyId
      ? ctx.parties?.find((currentParty) => currentParty.uuid === partyId)
      : ctx.parties?.[0]

    if (!partyUser || !party) {
      ctx.response.unauthorized({ errors: [{ message: 'Unauthenticated' }] })
      return
    }

    if (party.adminUuid !== partyUser.uuid) {
      ctx.response.forbidden({ errors: [{ message: 'Admin only' }] })
      return
    }

    await next()
  }
}
