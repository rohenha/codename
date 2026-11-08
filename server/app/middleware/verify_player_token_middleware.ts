import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { createHash } from 'node:crypto'
import PartyUsers from '#models/party_users'

export default class VerifyPlayerTokenMiddleware {
  /**
   * Vérifie le token du joueur depuis le header X-Player-Token
   * Attache le joueur au contexte si valide
   */
  async handle({ request }: HttpContext, next: NextFn) {
    const token = request.header('X-Player-Token')

    if (token) {
      try {
        // Hasher le token reçu et comparer avec celui en DB
        const hashedToken = createHash('sha256').update(token).digest('hex')
        const partyUser = await PartyUsers.findBy('token', hashedToken)
        if (partyUser) {
          Object.assign(request, { partyUser })
        }
      } catch {
        // Token invalide - continue sans erreur
      }
    }

    await next()
  }
}
