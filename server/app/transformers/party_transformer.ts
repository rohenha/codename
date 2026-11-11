import type Parties from '#models/parties'
import type User from '#models/user'
import { themesMap } from '#themes/themes'
import { BaseTransformer } from '@adonisjs/core/transformers'
import UserTransformer from '#transformers/user_transformer'

export default class PartyTransformer extends BaseTransformer<Parties> {
  toObject() {
    const preloadedAdmin = this.resource.$preloaded.admin

    return {
      ...this.pick(this.resource, ['uuid', 'name', 'adminId', 'createdAt', 'updatedAt', 'users']),
      themes: this.resource.themes.map((theme) => themesMap[theme]),
      admin:
        preloadedAdmin && !Array.isArray(preloadedAdmin)
          ? UserTransformer.transformLight(preloadedAdmin as User)
          : null,
      // users: this.resource.users,
    }
  }
}
