import type { HttpContext } from '@adonisjs/core/http'
import { themes } from '#themes/themes'
import { type Theme } from '#themes/theme.model'
import { createPartyValidator } from '#validators/party'
import { ValidationError } from '@vinejs/vine'
import Parties from '#models/parties'

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

  async store({ request, response }: HttpContext) {
    try {
      const payload = await createPartyValidator.validate(request.all())
      let party: Parties
      try {
        party = await Parties.create({
          name: payload.name,
          themes: payload.themes,
        })
      } catch (error) {
        const dbError = error as {
          message?: string
          code?: string
          errno?: number
          sqlState?: string
          sqlMessage?: string
          sql?: string
        }

        return response.status(500).send({
          errors: [
            {
              message: 'Unable to create party',
              details: {
                message: dbError.message ?? 'Unknown database error',
                code: dbError.code ?? null,
                errno: dbError.errno ?? null,
                sqlState: dbError.sqlState ?? null,
                sqlMessage: dbError.sqlMessage ?? null,
                sql: dbError.sql ?? null,
              },
            },
          ],
        })
      }

      return {
        party,
        errors: [],
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return response.status(422).send({
          errors: error.messages,
        })
      }

      return response.status(500).send({
        errors: [
          {
            message: 'Unexpected server error',
          },
        ],
      })
    }
  }

  async find({ params }: HttpContext) {
    const party = await Parties.query().where('uuid', params.partyId).firstOrFail()

    return party
  }
}
