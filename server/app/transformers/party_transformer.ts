import type Parties from '#models/parties'
import { themesMap } from '#themes/themes'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class PartyTransformer extends BaseTransformer<Parties> {
  toObject() {
    return {
      ...this.pick(this.resource, ['uuid', 'name', 'adminId', 'createdAt', 'updatedAt']),
      themes: this.resource.themes.map((theme) => themesMap[theme]),
    }
  }
}
