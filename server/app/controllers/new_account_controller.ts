import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class NewAccountController {
  async store({ request, auth, serialize }: HttpContext) {
    const { username, password } = await request.validateUsing(signupValidator)

    const user = await User.create({ username, password })
    await auth.use('web').login(user)

    return serialize({
      user: UserTransformer.transform(user),
    })
  }
}
