import { ZardInputComponent } from '@/shared/components/input';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { Component, inject, signal } from '@angular/core';
import { ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent } from '@/shared/components/card';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSelectImports } from '@/shared/components/select/select.imports'
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { delayLoading } from '@/tools/events';
import { ZardSonnerService } from '@/shared/components/sonner';
import { ZardSpinnerComponent } from '@/shared/components/spinner';
import { getErrors } from '@/tools/form';
import { AuthService } from '@/auth/auth-service';
@Component({
  selector: 'app-auth-form',
  imports: [ZardSpinnerComponent, ZardInputComponent, ZardFieldImports, ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent, ZardButtonComponent, ZardSelectImports, RouterLink, ReactiveFormsModule],
  templateUrl: './signin-form.html',
  styleUrl: './signin-form.css',
})
export class SignInForm {
  loading = signal<boolean>(false)
  router = inject(Router)
  protected readonly sonner = inject(ZardSonnerService)
  authService = inject(AuthService)
  errors = signal<Record<string, string[]>>({})

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(32)]
    }),
  })

  onSubmit() {
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
      this.authService.login(formData).subscribe({
        next: () => {
          this.sonner.success('Signup success')
          this.router.navigateByUrl(`/`)
        },
        error: () => {
          this.sonner.error('Credentials are not good')
          this.errors.set({ party_id: ['Credentials are not good'] })
          delayCancel(() => {
            this.loading.set(false)
          })
        }
      })
    }
}
