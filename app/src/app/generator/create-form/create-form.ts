import { ZardInputComponent } from '@/shared/components/input';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { Component, inject, signal } from '@angular/core';
import { ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent } from '@/shared/components/card';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSelectImports } from '@/shared/components/select/select.imports'
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { delayLoading } from '@/tools/events';
import { ThemesService } from '@/themes/themes-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PartyService } from '@/party/party-service';
import { ZardSonnerService } from '@/shared/components/sonner';
import { AuthService } from '@/auth/auth-service';

@Component({
  selector: 'app-create-form',
  imports: [ZardInputComponent, ZardFieldImports, ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent, ZardButtonComponent, ZardSelectImports, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './create-form.html',
  styleUrl: './create-form.css',
})
export class CreateForm {
  loading = signal<boolean>(false)
  themesService = inject(ThemesService)
  partyService = inject(PartyService)
  router = inject(Router)
  authService = inject(AuthService)
  protected readonly sonner = inject(ZardSonnerService);
  options = toSignal(
    this.themesService.getOptions().pipe(
      catchError(() => of([]))
    ),
    { initialValue: [] }
  )
  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required, Validators.maxLength(150)]}),
    themes: new FormControl([], { validators: [Validators.required]}),
    username: new FormControl('', { validators: [Validators.required, Validators.maxLength(150)]}),
  })


  onSubmit() {
    const delayCancel = delayLoading(() => {
      console.log('set animation')
      this.loading.set(true)
      return () => void 0
    }, 100)
    if (this.form.invalid) {
      this.form.markAllAsDirty()
      delayCancel(() => {
        this.loading.set(false)
      })
      return
    }

    delayCancel(() => {
      this.loading.set(false)
    })
    console.log(this.form.getRawValue())
    this.partyService.store(this.form.getRawValue() as { name: string, themes: string[], username: string}).subscribe({
      next: (data) => {
        if (data.partyUser.plainToken) {
          this.authService.storeToken(data.partyUser.plainToken)
        }
        this.sonner.success('The party has been created')
        this.router.navigateByUrl(`party/${data.party.uuid}`)
      },
      error: (err) => {
        this.sonner.error(err.message)
      }
    })
  }
}
