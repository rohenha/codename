import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  static transformLight(user: User) {
    return {
      id: user.id,
      username: user.username,
      initials: user.username.slice(0, 2).toUpperCase(),
    }
  }

  toObject() {
    // return this.pick(this.resource, ['id', 'username', 'createdAt', 'updatedAt'])
    return {
      ...this.pick(this.resource, ['id', 'username', 'createdAt', 'updatedAt']),
      initials: this.resource.username.slice(0, 2).toUpperCase(),
    }
  }
}
