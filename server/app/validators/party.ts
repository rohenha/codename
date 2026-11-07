import vine from '@vinejs/vine'

export const createPartyValidator = vine.create({
  name: vine.string().maxLength(150),
  username: vine.string().maxLength(150),
  themes: vine.array(vine.string()),
})

export const createPartyUserValidator = vine.create({
  username: vine.string().maxLength(150),
})
