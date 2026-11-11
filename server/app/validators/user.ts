import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const username = () => vine.string().maxLength(150)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  username: username().unique({ table: 'users', column: 'username' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  username: username(),
  password: vine.string(),
})
