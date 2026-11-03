import { ZardInputComponent } from '@/shared/components/input';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { Component, signal } from '@angular/core';
import { ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent } from '@/shared/components/card';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSelectImports } from '@/shared/components/select/select.imports'
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { delayLoading } from '@/tools/events';

@Component({
  selector: 'app-create-form',
  imports: [ZardInputComponent, ZardFieldImports, ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent, ZardButtonComponent, ZardSelectImports, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './create-form.html',
  styleUrl: './create-form.css',
})
export class CreateForm {
  loading = signal<boolean>(false)

  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required]}),
    players: new FormControl('', { validators: [Validators.required, Validators.min(2)]}),
    themes: new FormControl('', { validators: [Validators.required]}),
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
  }
}
