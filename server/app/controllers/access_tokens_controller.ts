import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
// import transmit from '@adonisjs/transmit/services/main'

export default class AccessTokensController {
  async store({ request, auth, serialize }: HttpContext) {
    const { username, password } = await request.validateUsing(loginValidator)
    // const { uid, content } = request.all()

    const user = await User.verifyCredentials(username, password)
    await auth.use('web').login(user)

    // Send to everyone in the login except the sender
    // transmit.broadcastExcept('login', { content }, uid)

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
