import type Party from '#models/party'
import type User from '#models/user'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    party: Party
    user: User
  }
}
