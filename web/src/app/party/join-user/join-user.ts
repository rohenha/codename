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
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8)]})
  })

  constructor() {
    const params = new URLSearchParams(document.location.search);
    const password = params.get('password')
    if (password) {
      this.form.setValue({ password })
    }
    // const partyId = params.get('party')
    effect(() => {
      const partyId = this.partyId()
      if (partyId) {
        this.partyService.join(partyId).subscribe({
          next: (party) => {
            this.party.set(party)
            this.loading.set(false)
          },
          error: () => {
            this.sonner.error('Party not found')
            this.router.navigateByUrl('')
          },
        })
      }
    })
  }

  onSubmit() {
    const party = this.party()
    const user = this.authService.currentUser()
      if (!party || !user) {
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
      this.partyService.addUser(party.uuid, { userId: user.id, password: formData.password}).subscribe({
        next: () => {
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
