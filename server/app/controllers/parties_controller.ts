import type { HttpContext } from '@adonisjs/core/http'
import { themes } from '#themes/themes'
import { type Theme } from '#themes/theme.model'
import { createPartyValidator, createPartyUserValidator } from '#validators/party'
import { ValidationError } from '@vinejs/vine'
import Parties from '#models/parties'
import PartyUsers from '#models/party_users'
import db from '@adonisjs/lucid/services/db'
import { setSessionCookies } from '#services/party_session'

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

  async store({ request, response, partyUser }: HttpContext) {
    try {
      const payload = await createPartyValidator.validate(request.all())

      try {
        // The party and its admin are created together so that a failure
        // never leaves an orphan party behind.
        const { party, userParty, tokens } = await db.transaction(async (trx) => {
          const createdParty = new Parties()
          createdParty.name = payload.name
          createdParty.themes = payload.themes
          createdParty.useTransaction(trx)
          await createdParty.save()

          if (partyUser) {
            createdParty.adminUuid = partyUser.uuid
            await createdParty.save()

            partyUser.useTransaction(trx)
            const sessionTokens = partyUser.issueSession()
            await partyUser.save()
            await trx.insertQuery().table('party_members').insert({
              party_uuid: createdParty.uuid,
              party_user_uuid: partyUser.uuid,
            })

            return { party: createdParty, userParty: partyUser, tokens: sessionTokens }
          }

          const createdUser = new PartyUsers()
          createdUser.username = payload.username
          createdUser.useTransaction(trx)
          const sessionTokens = createdUser.issueSession()
          await createdUser.save()
          await trx.insertQuery().table('party_members').insert({
            party_uuid: createdParty.uuid,
            party_user_uuid: createdUser.uuid,
          })

          createdParty.adminUuid = createdUser.uuid
          await createdParty.save()

          return { party: createdParty, userParty: createdUser, tokens: sessionTokens }
        })

        // Tokens are only sent as HttpOnly cookies, never in the JSON body.
        setSessionCookies(response, tokens)
        const sessionUser = await PartyUsers.query()
          .where('uuid', userParty.uuid)
          .preload('parties')
          .firstOrFail()

        return {
          party: party,
          partyUser: sessionUser.serialize(),
          errors: [],
        }
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

  async addUser({ params, request, response, partyUser }: HttpContext) {
    try {
      const payload = await createPartyUserValidator.validate(request.all())
      const party = await Parties.find(params.partyId)

      if (!party) {
        return response.notFound({
          errors: [
            {
              message: 'Party not found',
            },
          ],
        })
      }

      try {
        const { sessionUser, tokens } = await db.transaction(async (trx) => {
          if (partyUser) {
            partyUser.useTransaction(trx)
            const sessionTokens = partyUser.issueSession()
            await partyUser.save()

            const isAlreadyMember = partyUser.parties.some(
              (memberParty) => memberParty.uuid === party.uuid
            )

            if (!isAlreadyMember) {
              await trx.insertQuery().table('party_members').insert({
                party_uuid: party.uuid,
                party_user_uuid: partyUser.uuid,
              })
            }

            return { sessionUser: partyUser, tokens: sessionTokens }
          }

          const createdUser = new PartyUsers()
          createdUser.username = payload.username
          createdUser.useTransaction(trx)
          const sessionTokens = createdUser.issueSession()
          await createdUser.save()
          await trx.insertQuery().table('party_members').insert({
            party_uuid: party.uuid,
            party_user_uuid: createdUser.uuid,
          })

          return { sessionUser: createdUser, tokens: sessionTokens }
        })

        setSessionCookies(response, tokens)

        const refreshedUser = await PartyUsers.query()
          .where('uuid', sessionUser.uuid)
          .preload('parties')
          .firstOrFail()

        return {
          partyUser: refreshedUser.serialize(),
          errors: [],
        }
      } catch (error) {
        const dbError = error as DatabaseError

        return response.status(500).send({
          errors: [
            {
              message: 'Unable to add party user',
              details: dbError,
            },
          ],
        })
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
