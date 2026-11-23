import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Transmit } from '@adonisjs/transmit-client'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SseService implements OnDestroy  {
  transmit: Transmit
  subsriptions: Subscription[] = []
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

  async usersSubscription(partyId: string, callback: (data: any) => void) {
    const subscription = this.transmit.subscription(`party/${partyId}/home`)
    await subscription.create()
    this.subsriptions.push(subscription)

    subscription.onMessage(callback)

    return subscription
  }

  ngOnDestroy() {
    this.transmit.close()
  }
}
