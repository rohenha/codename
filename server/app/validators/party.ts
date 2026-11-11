import vine from '@vinejs/vine'

export const createPartyValidator = vine.create({
  name: vine.string().maxLength(150),
  themes: vine.array(vine.string()),
})

export const addUserPartyValidator = vine.create({
  password: vine.string().minLength(8).maxLength(8),
})
