import { sportTheme } from './sport.js'
import { videoGamesTheme } from './video-games.js'
import { generalKnowledgeTheme } from './general-knowledge.js'
import { cinemaTheme } from './cinema.js'
import { musicTheme } from './music.js'
import { animalsTheme } from './animals.js'
import { geographyTheme } from './geography.js'
import { historyTheme } from './history.js'
import { technologyTheme } from './technology.js'
import { gastronomyTheme } from './gastronomy.js'
import { artTheme } from './art.js'

export const themes = [
  sportTheme,
  videoGamesTheme,
  generalKnowledgeTheme,
  cinemaTheme,
  musicTheme,
  animalsTheme,
  geographyTheme,
  historyTheme,
  technologyTheme,
  gastronomyTheme,
  artTheme,
]

export const themesMap = Object.fromEntries(themes.map((theme) => [theme.id, theme]))
