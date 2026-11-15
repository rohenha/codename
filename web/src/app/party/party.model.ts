import { User } from "@/auth/auth.model"

export interface Party {
  uuid: string
  name: string
  themes: { id: string, label: string }[]
  users: User[]
  adminId: number
  createdAt: Date
  updatedAt: Date
  admin: { id: number, username: string, initials: string }
  password?: string
}
