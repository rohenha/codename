import env from '#start/env'
import { defineConfig, drivers } from '@adonisjs/core/encryption'

export default defineConfig({
  default: 'app',
  list: {
    app: drivers.legacy({
      keys: [env.get('APP_KEY')],
    }),
  },
})
