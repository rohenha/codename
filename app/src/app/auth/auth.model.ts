import { Party } from "@/party/party.model"

export interface PartyUser {
  uuid: string
  username: string
  parties: Party[]
}
