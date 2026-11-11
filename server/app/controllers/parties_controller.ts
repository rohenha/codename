import type { HttpContext } from '@adonisjs/core/http'
import { themes } from '#themes/themes'
import { type Theme } from '#themes/theme.model'
import Parties from '#models/parties'
import { createPartyValidator, addUserPartyValidator } from '#validators/party'
import PartyTransformer from '#transformers/party_transformer'
import encryption from '@adonisjs/core/services/encryption'

export default class PartiesController {
  async roundGeneration({ response }: HttpContext) {
    const fromThemes = ['cinema', 'sport', 'history']
    const wordsNbr = 25
    const themesWords = themes.reduce((acc: String[], theme: Theme) => {
      if (fromThemes.includes(theme.id)) {
        acc = [...acc, ...theme.words]
      }
      return acc
    }, [])
    const filteredWords = themesWords.sort(() => Math.random() - 0.5).slice(0, wordsNbr)
    return response.json({
      data: filteredWords,
    })
  }

  async store({ request, auth, serialize }: HttpContext) {
    const { name, themes: themesArray } = await request.validateUsing(createPartyValidator)
    const user = await auth.getUserOrFail()
    const party = await Parties.create({ name, themes: themesArray, adminId: user.id })
    await party.related('users').attach([user.id])

    return serialize({
      party: PartyTransformer.transform(party),
    })
  }

  async show({ params, auth, serialize, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const party = await Parties.query()
      .where('uuid', params.partyId)
      .preload('users')
      .preload('admin')
      .firstOrFail()

    const existsUserInParty = party.users.find((partyUser) => user.id === partyUser.id)

    if (!existsUserInParty) {
      return response.status(403).json({
        error: {
          code: 'PARTY_ACCESS_DENIED',
          message: 'Vous ne faites pas partie de cette party',
        },
      })
    }

    const partyResponse = await serialize({
      party: PartyTransformer.transform(party),
    })

    if (party.adminId === user.id) {
      const decryptedPassword = (await encryption.decrypt(party.password)) as string

      type SerializablePartyResponse = Awaited<ReturnType<typeof serialize>> & {
        data: {
          party: {
            password?: string
          }
        }
      }

      const adminResponse = partyResponse as SerializablePartyResponse
      adminResponse.data.party.password = decryptedPassword
      return response.json(adminResponse)
    }

    return partyResponse
  }

  async join({ params, serialize }: HttpContext) {
    const party = await Parties.query().where('uuid', params.partyId).firstOrFail()

    return serialize({
      party: PartyTransformer.transform(party),
    })
  }

  async addUser({ params, auth, serialize, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const party = await Parties.query()
      .where('uuid', params.partyId)
      .preload('users')
      .preload('admin')
      .firstOrFail()
    const payload = await request.validateUsing(addUserPartyValidator)

    // if ()
  }
}
