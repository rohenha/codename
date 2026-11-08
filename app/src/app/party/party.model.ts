export interface Party {
  uuid: string
  name: string
  themes: string[]
  users: PartyUser[]
  adminUuid: string
  createdAt: Date
  updatedAt: Date
}

export interface PartyUser {
  uuid: string
  username: string
}
