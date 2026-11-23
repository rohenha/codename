import { ZardInputComponent } from '@/shared/components/input';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { Component, computed, effect, inject, input, resource, signal } from '@angular/core';
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
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-join-form',
  imports: [ZardSpinnerComponent, ZardInputComponent, ZardFieldImports, ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent, ZardButtonComponent, ZardSelectImports, RouterLink, ReactiveFormsModule],
  templateUrl: './join-user.html',
  styleUrl: './join-user.css',
})
export class JoinUser {
  partyId = input.required<string>()
  loadingJoin = signal<boolean>(false)
  router = inject(Router)
  protected readonly sonner = inject(ZardSonnerService)
  partyService = inject(PartyService)
  authService = inject(AuthService)
  errors = signal<Record<string, string[]>>({})

  partyResource = resource<Party, string>({
    params: () => this.partyId(),
    loader: async ({ params }) => firstValueFrom(this.partyService.getJoinParty(params)),
  });

  party = computed(() => this.partyResource.value());
  loading = this.partyResource.isLoading;

  form = new FormGroup({
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8)]})
  })

  constructor() {
    const params = new URLSearchParams(document.location.search);
    const password = params.get('password')
    if (password) {
      this.form.setValue({ password })
    }
    effect(() => {
      const err = this.partyResource.error();
      if (err) {
        this.sonner.error('Party does not exist');
      }
    });
  }

  onSubmit() {
    const party = this.party()
    const user = this.authService.currentUser()
      if (!party || !user) {
        return
      }
      this.errors.set({})
      const delayCancel = delayLoading(() => {
        this.loadingJoin.set(true)
        return () => void 0
      }, 100)
      if (this.form.invalid) {
        this.form.markAllAsDirty()
        const errors = getErrors(this.form.controls)
        this.errors.set(errors)
        delayCancel(() => {
          this.loadingJoin.set(false)
        })
        return
      }
      const formData = this.form.getRawValue()
      this.partyService.addUser(party.uuid, { userId: user.id, password: formData.password}).subscribe({
        next: () => {
          this.router.navigateByUrl(`party/${party.uuid}`)
        },
        error: () => {
          this.sonner.error('Player was not added')
          this.errors.set({ party_id: ['Player was not added'] })
          delayCancel(() => {
            this.loadingJoin.set(false)
          })
        }
      })
    }
}
