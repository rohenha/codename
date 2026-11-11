import { Party } from "@/party/party.model"

export interface User {
  uuid: string
  username: string
  parties: Party[]
}
