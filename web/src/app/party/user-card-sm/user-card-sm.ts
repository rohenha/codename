import { Component, computed, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { ZardItemComponent, ZardItemMediaComponent, ZardItemContentComponent, ZardItemTitleComponent, ZardItemActionsComponent } from '@/shared/components/item';
import { NgIcon } from '@ng-icons/core';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSonnerService } from '@/shared/components/sonner';
import { Router } from '@angular/router';
import { Party } from '../party.model';
import { AuthService } from '@/auth/auth-service';
// import { delayLoading } from '@/tools/events';
import { User } from '@/auth/auth.model';
import { PartyService } from '../party-service';
import { delayLoading } from '@/tools/events';
import { LoginBadge } from '@/profile/login-badge/login-badge';

@Component({
  selector: 'app-user-card-sm',
  imports: [ZardItemComponent, ZardItemMediaComponent, NgIcon, ZardItemContentComponent, ZardItemTitleComponent, ZardItemActionsComponent, ZardBadgeComponent, ZardButtonComponent, LoginBadge],
  templateUrl: './user-card-sm.html',
  styleUrl: './user-card-sm.css',
})
export class UserCardSm {
  user = input.required<User>()
  isEditable = input<boolean>(false)
  party = input.required<Party|undefined>()
  authService = inject(AuthService)
  router = inject(Router)
  loadingDelete = signal(false)
  confirmDelete = signal<boolean>(false)
  isMe = computed(() => {
    return this.user().id === this.authService.currentUser()?.id
  })
  canUserEdit = computed(() => {
    const party = this.party()
    return this.authService.currentUser()?.id === party?.adminId
  })
  isAdmin= computed(() => {
    const user = this.user()
    const party = this.party()
    return user.id === party?.adminId
  })
  @Output() deleteEvent = new EventEmitter<number|undefined>()
  @Output() confirmDeleteEvent = new EventEmitter<Party>()
  partyService = inject(PartyService)
  protected readonly sonner = inject(ZardSonnerService)


  setDeleteId() {
    const user = this.user()
    // this.deleteId.set(user.id)
    this.confirmDelete.set(true)
    this.deleteEvent.emit(user.id)
  }

  cancelDeleteId() {
    this.confirmDelete.set(false)
    this.deleteEvent.emit(undefined)
  }

  async removeUser() {
    const party = this.party()
    const user = this.user()

    const loadingDelete = this.loadingDelete()
    if (!party || !user || loadingDelete) {
      return
    }

    const deleteId = user.id
    const delayCancel = delayLoading(() => {
      this.loadingDelete.set(true)
      return () => void 0
    }, 100)

    this.partyService.removeUser(party.uuid, { userId: deleteId}).subscribe({
      next: (partyUpdated) => {
        const userDeleted = party.users.find((user) => user.id === deleteId)
        this.sonner.success(`User ${userDeleted?.username} has been deleted`)
        // this.party.set(partyUpdated)
        this.confirmDeleteEvent.emit(partyUpdated)
        delayCancel(() => {
          this.loadingDelete.set(false)
        })
      },
      error: () => {
        const userDeleted = party.users.find((user) => user.id === deleteId)
        this.sonner.success(`There is an error when deleting ${userDeleted?.username}`)
        delayCancel(() => {
          this.loadingDelete.set(false)
        })
      }
    })
  }
}
