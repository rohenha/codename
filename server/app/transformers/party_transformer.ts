import type Party from '#models/party'
import type User from '#models/user'
import { themesMap } from '#themes/themes'
import { BaseTransformer } from '@adonisjs/core/transformers'
import UserTransformer from '#transformers/user_transformer'

export default class PartyTransformer extends BaseTransformer<Party> {
  static transformLight(party: Party) {
    return {
      uuid: party.uuid,
      name: party.name,
      themes: party.themesList?.map((theme: string) => themesMap[theme]),
    }
  }

  toObject() {
    const preloadedAdmin = this.resource.$preloaded.admin

    return {
      ...this.pick(this.resource, [
        'uuid',
        'name',
        'adminId',
        'createdAt',
        'updatedAt',
        'users',
        'teams',
      ]),
      themes: this.resource.themesList?.map((theme: string) => themesMap[theme]),
      admin:
        preloadedAdmin && !Array.isArray(preloadedAdmin)
          ? UserTransformer.transformLight(preloadedAdmin as User)
          : null,
      // users: this.resource.users,
    }
  }
}
