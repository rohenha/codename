import type Parties from '#models/parties'
import type PartyUsers from '#models/party_users'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    /**
     * Set by the partyAuth middleware once the player token has been verified.
     */
    partyUser?: PartyUsers

    /**
     * Parties the current player belongs to. Loaded by the partyAuth middleware.
     */
    parties?: Parties[]
  }
}
