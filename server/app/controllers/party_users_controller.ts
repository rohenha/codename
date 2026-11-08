import type { HttpContext } from '@adonisjs/core/http'

export default class PartyUsersController {
  /**
   * Returns the player and the party linked to the current token.
   *
   * Protected by the partyAuth middleware.
   */
  async me({ partyUser }: HttpContext) {
    if (!partyUser) {
      throw new Error('The partyAuth middleware must run before this controller method')
    }

    return partyUser.serialize()
  }
}
