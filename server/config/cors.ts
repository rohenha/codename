import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/cors'

const corsConfig = defineConfig({
  enabled: (ctx) => ctx.request.url().startsWith('/api'),

  origin: (requestOrigin, ctx) => {
    if (!app.inProduction) {
      return ['http://localhost:4200', 'http://localhost:3000']
    }
    return false
  },

  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
