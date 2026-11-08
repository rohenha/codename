import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import PartyUsers from '#models/party_users'
import { ACCESS_COOKIE } from '#services/party_session'

/**
 * Authenticates a party player from the HttpOnly access cookie.
 *
 * When the route contains a ":partyId" param, the middleware also checks
 * that the player belongs to this party and responds with a 403 otherwise.
 *
 * An expired access token returns a 401: the Angular interceptor then calls
 * "/api/auth/refresh" to obtain a new access cookie.
 */
export default class PartyAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = this.readToken(ctx)

    if (!token) {
      this.reject(ctx, 'Unauthenticated')
      return
    }

    const partyUser = await PartyUsers.findByAccessToken(token)

    if (!partyUser || !partyUser.hasValidAccessToken()) {
      this.reject(ctx, 'Unauthenticated')
      return
    }

    const partyId = ctx.params.partyId
    const isMember = !partyId || partyUser.parties.some((party) => party.uuid === partyId)

    if (!isMember) {
      ctx.response.forbidden({
        errors: [{ message: 'You are not allowed to access this party' }],
      })
      return
    }

    ctx.partyUser = partyUser
    ctx.parties = partyUser.parties

    await next()
  }

  private readToken({ request }: HttpContext): string | undefined {
    const token = request.plainCookie(ACCESS_COOKIE)
    return typeof token === 'string' && token.length > 0 ? token : undefined
  }

  private reject(ctx: HttpContext, message: string) {
    ctx.response.unauthorized({ errors: [{ message }] })
  }
}
