import type { HttpContext } from '@adonisjs/core/http'
import { themes } from '#themes/themes'
import { type Theme } from '#themes/theme.model'

export default class ThemesController {
  async options({ response }: HttpContext) {
    const options = themes.reduce((acc: Array<{ id: string; label: string }>, theme: Theme) => {
      acc.push({ id: theme.id, label: theme.label })
      return acc
    }, [])
    return response.json({
      data: options,
    })
  }
}
