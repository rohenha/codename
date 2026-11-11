import PartyTransformer from '#transformers/party_transformer'
import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ auth, serialize }: HttpContext) {
    return serialize(UserTransformer.transform(auth.getUserOrFail()))
  }

  async parties({ auth, serialize }: HttpContext) {
    const user = await auth.getUserOrFail()
    const parties = await user.related('parties').query()

    return serialize({
      parties: PartyTransformer.transform(parties),
    })
  }
}
