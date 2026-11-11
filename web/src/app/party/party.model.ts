export interface Party {
  uuid: string
  name: string
  themes: { id: string, label: string }[]
  users: User[]
  adminId: number
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: number
  createdAt: Date
  updatedAt: Date
  username: string
}
