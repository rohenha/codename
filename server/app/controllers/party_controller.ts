import type { HttpContext } from '@adonisjs/core/http'
import { themes } from '#themes/themes'
import { type Theme } from '#themes/theme.model'
import Party from '#models/party'
import {
  createPartyValidator,
  addUserPartyValidator,
  removeUserPartyValidator,
} from '#validators/party'
import PartyTransformer from '#transformers/party_transformer'
import encryption from '@adonisjs/core/services/encryption'
import transmit from '@adonisjs/transmit/services/main'

export default class PartyController {
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
    const party = await Party.create({ name, themesList: themesArray, adminId: user.id })
    await party.related('users').attach([user.id])

    return serialize({
      party: PartyTransformer.transform(party),
    })
  }

  async show({ serialize, response, party, user }: HttpContext) {
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

  async join({ serialize, party }: HttpContext) {
    return serialize({
      party: PartyTransformer.transformLight(party),
    })
  }

  async addUser({ params, serialize, request, response, party, user }: HttpContext) {
    const { password } = await request.validateUsing(addUserPartyValidator)
    const partyId = params.partyId

    const existsUserInParty = party.users.find((partyUser) => user.id === partyUser.id)
    const decryptedPassword = (await encryption.decrypt(party.password)) as string

    if (decryptedPassword !== password) {
      return response.status(403).json({
        error: {
          code: 'PARTY_ACCESS_DENIED',
          message: 'incorrect password',
        },
      })
    }

    if (existsUserInParty) {
      return response.status(403).json({
        error: {
          code: 'PARTY_ACCESS_DENIED',
          message: 'User already exists in party',
        },
      })
    }

    await party.related('users').attach([user.id])

    transmit.broadcast(`party/${partyId}`, {
      status: 'user_added',
      message: `User ${user.username} has been added`,
    })

    return serialize({
      party: PartyTransformer.transform(party),
    })
  }

  async removeUser({ response, serialize, request, party, user }: HttpContext) {
    const { userId } = await request.validateUsing(removeUserPartyValidator)
    try {
      await party.related('users').detach([userId])
      await party.load('users')
      transmit.broadcast(`party/${party.uuid}`, {
        status: 'user_removed',
        message: `User ${userId} has been removed`,
      })

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
    } catch (e) {
      return response.status(500).json({
        error: {
          code: 'PARTY_ACCESS_DENIED',
          message: 'Error when trying to detach user',
        },
      })
    }
  }

  async initParty({ response, serialize, request, party }: HttpContext) {
    transmit.broadcast(`party/${party.uuid}/steps`, {
      status: 'party_ready',
      message: `Party is ready`,
    })

    return null
  }

  async getTeams({ response, serialize, request, party }: HttpContext) {
    return null
  }
}
