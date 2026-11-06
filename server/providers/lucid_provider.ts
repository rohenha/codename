import type { ApplicationService } from '@adonisjs/core/types'

/**
 * Lucid provider that registers the database service
 */
export default class LucidProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    // Import the provider dynamically to avoid type issues
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    import('@adonisjs/lucid/database_provider' as any).then((mod: any) => {
      const DatabaseServiceProvider = mod.default
      const provider = new DatabaseServiceProvider(this.app)
      provider.register()
    })
  }

  async boot() {
    // Lucid boot is called after register
  }

  async start() {
    // Lucid start is called when the app starts
  }
}
