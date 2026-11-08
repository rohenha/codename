import type { HttpContext } from '@adonisjs/core/http'
import PartyUsers from '#models/party_users'
import { REFRESH_COOKIE, clearSessionCookies, setSessionCookies } from '#services/party_session'

export default class PartyUsersController {
  /**
   * Returns the player and the party linked to the current access cookie.
   *
   * Protected by the partyAuth middleware.
   */
  async me({ partyUser }: HttpContext) {
    if (!partyUser) {
      throw new Error('The partyAuth middleware must run before this controller method')
    }

    return partyUser.serialize()
  }

  /**
   * Rotates the session from the HttpOnly refresh cookie.
   *
   * The old refresh token is invalidated as soon as the new one is stored.
   */
  async refresh({ request, response }: HttpContext) {
    const token = request.plainCookie(REFRESH_COOKIE)

    if (typeof token !== 'string' || !token) {
      return response.unauthorized({ errors: [{ message: 'Unauthenticated' }] })
    }

    const partyUser = await PartyUsers.findByRefreshToken(token)

    if (!partyUser || !partyUser.hasValidRefreshToken()) {
      clearSessionCookies(response)
      return response.unauthorized({ errors: [{ message: 'Unauthenticated' }] })
    }

    const tokens = partyUser.issueSession()
    await partyUser.save()
    setSessionCookies(response, tokens)

    return partyUser.serialize()
  }

  /**
   * Clears the session and both authentication cookies.
   */
  async logout({ request, response }: HttpContext) {
    const token = request.plainCookie(REFRESH_COOKIE)

    if (typeof token === 'string' && token) {
      const partyUser = await PartyUsers.findByRefreshToken(token)
      if (partyUser) {
        await partyUser.clearSession()
      }
    }

    clearSessionCookies(response)
    return { success: true }
  }
}
