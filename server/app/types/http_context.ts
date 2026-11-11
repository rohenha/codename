import type Parties from '#models/parties'
import type User from '#models/user'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    party: Parties
    user: User
  }
}
