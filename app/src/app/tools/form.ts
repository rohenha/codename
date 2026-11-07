export const getErrors = <T extends Record<string, { errors?: Record<string, unknown> | null }>>(controls: T) => {
    const errors: Record<string, string[]> = {}
    Object.keys(controls).forEach((formKey) => {
      const control = controls[formKey as keyof typeof controls]
      if (control.errors) {
        errors[formKey] = []
        Object.keys(control.errors).forEach((controlKey) => {
          switch (controlKey) {
            case 'minlength':
              errors[formKey].push('Field is too short')
              break;
            case 'maxlength':
              errors[formKey].push('Field is too long')
              break;
            default:
              errors[formKey].push('Field has error')
              break;
          }
        })
      }
    });
    return errors
  }
