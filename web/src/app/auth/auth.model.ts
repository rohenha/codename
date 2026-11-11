import { Party } from "@/party/party.model"

export interface User {
  id: number
  username: string
  initials: string
  parties: Party[]
}
