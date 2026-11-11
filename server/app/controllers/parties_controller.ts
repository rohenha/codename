import type { HttpContext } from '@adonisjs/core/http'
import { themes } from '#themes/themes'
import { type Theme } from '#themes/theme.model'
import Parties from '#models/parties'
import { createPartyValidator } from '#validators/party'
import PartyTransformer from '#transformers/party_transformer'
// type DatabaseError = {
//   message?: string
//   code?: string
//   errno?: number
//   sqlState?: string
//   sqlMessage?: string
//   sql?: string
// }

export default class PartiesController {
  async roundGeneration() {
    const fromThemes = ['cinema', 'sport', 'history']
    const wordsNbr = 25
    const themesWords = themes.reduce((acc: String[], theme: Theme) => {
      if (fromThemes.includes(theme.id)) {
        acc = [...acc, ...theme.words]
      }
      return acc
    }, [])
    const filteredWords = themesWords.sort(() => Math.random() - 0.5).slice(0, wordsNbr)
    return {
      data: filteredWords,
    }
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

  async show({ params, serialize }: HttpContext) {
    const party = await Parties.query().where('uuid', params.partyId).preload('users').firstOrFail()
    return serialize({
      party: PartyTransformer.transform(party),
    })
  }
}
