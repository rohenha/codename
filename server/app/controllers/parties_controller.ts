import type { HttpContext } from '@adonisjs/core/http'
import { themes } from '#themes/themes'
import { type Theme } from '#themes/theme.model'
import { createPartyValidator, createPartyUserValidator } from '#validators/party'
import { ValidationError } from '@vinejs/vine'
import Parties from '#models/parties'
import PartyUsers from '#models/party_users'

type DatabaseError = {
  message?: string
  code?: string
  errno?: number
  sqlState?: string
  sqlMessage?: string
  sql?: string
}

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
        const dbError = error as DatabaseError

        return response.status(500).send({
          errors: [
            {
              message: 'Unable to create party',
              details: dbError,
            },
          ],
        })
      }
      let userParty: PartyUsers
      try {
        userParty = await PartyUsers.create({
          username: payload.username,
          partyUuid: party.uuid,
        })
        party.adminUuid = userParty.uuid
        await party.save()
      } catch (error) {
        const dbError = error as DatabaseError

        return response.status(500).send({
          errors: [
            {
              message: 'Unable to create party user',
              details: dbError,
            },
          ],
        })
      }
      return {
        party: party,
        partyUser: userParty.serializeAfterCreation(),
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
    const party = await Parties.query().where('uuid', params.partyId).preload('users').firstOrFail()
    return party
  }

  async addUser({ params, request, response }: HttpContext) {
    const party = await Parties.query().where('uuid', params.partyId).firstOrFail()

    try {
      const payload = await createPartyUserValidator.validate(request.all())
      let partyUser: PartyUsers
      try {
        partyUser = await PartyUsers.create({
          username: payload.username,
          partyUuid: party.uuid,
        })
      } catch (error) {
        const dbError = error as DatabaseError

        return response.status(500).send({
          errors: [
            {
              message: 'Unable to create party',
              details: dbError,
            },
          ],
        })
      }

      return {
        partyUser: partyUser.serializeAfterCreation(),
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
}
