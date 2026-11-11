import { ZardInputComponent } from '@/shared/components/input';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { Component, effect, inject, input, signal } from '@angular/core';
import { ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent } from '@/shared/components/card';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSelectImports } from '@/shared/components/select/select.imports'
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { delayLoading } from '@/tools/events';
import { PartyService } from '@/party/party-service';
import { ZardSonnerService } from '@/shared/components/sonner';
import { ZardSpinnerComponent } from '@/shared/components/spinner';
import { getErrors } from '@/tools/form';
import { Party } from '@/party/party.model';
import { AuthService } from '@/auth/auth-service';
@Component({
  selector: 'app-join-form',
  imports: [ZardSpinnerComponent, ZardInputComponent, ZardFieldImports, ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent, ZardButtonComponent, ZardSelectImports, RouterLink, ReactiveFormsModule],
  templateUrl: './join-user.html',
  styleUrl: './join-user.css',
})
export class JoinUser {
  partyId = input.required<string>()
  loading = signal<boolean>(false)
  router = inject(Router)
  protected readonly sonner = inject(ZardSonnerService)
  partyService = inject(PartyService)
  authService = inject(AuthService)
  errors = signal<Record<string, string[]>>({})
  party = signal<Party | undefined>(undefined)

  form = new FormGroup({
    // username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)]})
    username: new FormControl({
      value: this.authService.currentUser()?.username ?? '',
      disabled: this.authService.currentUser() !== undefined
    }, {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)]
    }),
  })

  constructor() {
    effect(() => {
      const partyId = this.partyId()
      if (partyId) {
        this.partyService.getParty(partyId).subscribe({
          next: async (party) => {
            this.party.set(party)
            this.loading.set(false)
          },
          error: () => {
            this.router.navigateByUrl('')
          },
        })
      }
    })
  }

  onSubmit() {
    const party = this.party()
      if (!party) {
        return
      }
      this.errors.set({})
      const delayCancel = delayLoading(() => {
        this.loading.set(true)
        return () => void 0
      }, 100)
      if (this.form.invalid) {
        this.form.markAllAsDirty()
        const errors = getErrors(this.form.controls)
        this.errors.set(errors)
        delayCancel(() => {
          this.loading.set(false)
        })
        return
      }
      const formData = this.form.getRawValue()
      this.partyService.addUser(party.uuid, formData).subscribe({
        next: (user) => {
          // this.authService.currentUser.set(user)
          this.router.navigateByUrl(`party/${party.uuid}`)
        },
        error: () => {
          this.sonner.error('Player wat not added')
          this.errors.set({ party_id: ['Player wat not added'] })
          delayCancel(() => {
            this.loading.set(false)
          })
        }
      })
    }
}
