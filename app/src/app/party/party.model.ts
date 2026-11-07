export interface Party {
  uuid: string
  name: string
  themes: string[]
  users: PartyUser[]
}

export interface PartyUser {
  uuid: string
  username: string
}
