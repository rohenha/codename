import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import PartyUsers from '#models/party_users'

/**
 * Authenticates a party player from its plain token.
 *
 * The token can be sent either via the "X-Player-Token" header or via
 * the "Authorization: Bearer <token>" header.
 *
 * When the route contains a ":partyId" param, the middleware also checks
 * that the player belongs to this party and responds with a 403 otherwise.
 */
export default class PartyAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = this.readToken(ctx)

    if (!token) {
      this.reject(ctx, 'Unauthenticated')
      return
    }

    const partyUser = await PartyUsers.query()
      .where('token', PartyUsers.hashToken(token))
      .preload('parties')
      .first()

    if (!partyUser) {
      this.reject(ctx, 'Unauthenticated')
      return
    }

    const partyId = ctx.params.partyId
    if (partyId && partyId !== partyUser.partyUuid) {
      ctx.response.forbidden({
        errors: [{ message: 'You are not allowed to access this party' }],
      })
      return
    }

    ctx.partyUser = partyUser
    ctx.parties = partyUser.parties

    await next()
  }

  /**
   * Reads the plain token from the supported headers.
   */
  private readToken({ request }: HttpContext): string | undefined {
    const headerToken = request.header('x-player-token')
    if (headerToken) {
      return headerToken.trim()
    }

    const authorization = request.header('authorization')
    const bearerMatch = authorization?.match(/^Bearer\s+(.+)$/i)
    return bearerMatch?.[1]?.trim()
  }

  private reject(ctx: HttpContext, message: string) {
    ctx.response.unauthorized({ errors: [{ message }] })
  }
}
