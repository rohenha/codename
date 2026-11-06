// import type { HttpContext } from '@adonisjs/core/http'
import { themes } from '#themes/themes'
import { type Theme } from '#themes/theme.model'

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
}
