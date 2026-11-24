import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Transmit } from '@adonisjs/transmit-client'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SseService implements OnDestroy  {
  transmit: Transmit
  subsription: Subscription | undefined = undefined
  constructor() {
    this.transmit = new Transmit({
      baseUrl: environment.sseUrl,
    })

    this.transmit.on('connected', () => {
      console.log('SSE connection established')
    })

    this.transmit.on('disconnected', () => {
      console.log('SSE connection lost')
    })

    this.transmit.on('reconnecting', () => {
      console.log('Attempting to reconnect...')
    })
  }

  async partySubscription(partyId: string, callback: (data: { status: string, message: string}) => void) {
    const subscription = this.transmit.subscription(`party/${partyId}`)
    await subscription.create()
    this.subsription = subscription

    subscription.onMessage(callback)
  }

  async clearSubscription() {
    await this.subsription?.delete()
  }


  ngOnDestroy() {
    this.transmit.close()
  }
}
