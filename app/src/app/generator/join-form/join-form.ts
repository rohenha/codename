import { ZardInputComponent } from '@/shared/components/input';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { Component, signal } from '@angular/core';
import { ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent } from '@/shared/components/card';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSelectImports } from '@/shared/components/select/select.imports'
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { delayLoading } from '@/tools/events';

@Component({
  selector: 'app-join-form',
  imports: [ZardInputComponent, ZardFieldImports, ZardCardComponent, ZardCardHeaderComponent, ZardCardContentComponent, ZardButtonComponent, ZardSelectImports, RouterLink, ReactiveFormsModule],
  templateUrl: './join-form.html',
  styleUrl: './join-form.css',
})
export class JoinForm {
  loading = signal<boolean>(false)
  form = new FormGroup({
    party_id: new FormControl('', { validators: [Validators.required, Validators.minLength(12), Validators.maxLength(12)]})
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
