import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class AccessTokensController {
  async store({ request, auth, serialize }: HttpContext) {
    const { username, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(username, password)
    await auth.use('web').login(user)

    return serialize({
      user: UserTransformer.transform(user),
    })
  }

  async destroy({ auth }: HttpContext) {
    await auth.use('web').authenticate()
    await auth.use('web').logout()

    return {
      message: 'Logged out successfully',
    }
  }
}
