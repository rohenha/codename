import { ZardInputComponent } from '@/shared/components/input';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { Component, inject, signal } from '@angular/core';
import { ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent } from '@/shared/components/card';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSelectImports } from '@/shared/components/select/select.imports'
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { delayLoading } from '@/tools/events';
import { PartyService } from '@/party/party-service';
import { ZardSonnerService } from '@/shared/components/sonner';
import { getErrors } from '@/tools/form';
@Component({
  selector: 'app-join-form',
  imports: [ZardInputComponent, ZardFieldImports, ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent, ZardButtonComponent, ZardSelectImports, RouterLink, ReactiveFormsModule],
  templateUrl: './join-form.html',
  styleUrl: './join-form.css',
})
export class JoinForm {
  loading = signal<boolean>(false)
  router = inject(Router)
  protected readonly sonner = inject(ZardSonnerService);
  partyService = inject(PartyService)
  errors = signal<Record<string, string[]>>({})
  form = new FormGroup({
    party_id: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(36), Validators.maxLength(36)]})
  })

  onSubmit() {
      this.errors.set({})
      const delayCancel = delayLoading(() => {
        this.loading.set(true)
        return () => void 0
      }, 100)
      if (this.form.invalid) {
        this.form.markAllAsDirty()
        const errors = getErrors<{ party_id: FormControl<string> }>(this.form.controls)
        this.errors.set(errors)
        delayCancel(() => {
          this.loading.set(false)
        })
        return
      }
      const formData = this.form.getRawValue()
      this.partyService.getParty(formData.party_id).subscribe({
        next: (party) => {
          this.router.navigateByUrl(`join/${party.uuid}`)
          delayCancel(() => {
            this.loading.set(false)
          })
        },
        error: () => {
          this.sonner.error('Party was not found')
          this.errors.set({ party_id: ['Party was not found'] })
          delayCancel(() => {
            this.loading.set(false)
          })
        }
      })



    }
}
