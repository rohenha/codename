const errorsMethods = {
  required: (name: string) => `Field ${name} is required`,
  minlength: (name: string, { requiredLength }: { requiredLength: number, actualLength: number }) => `Field ${name} is too short (min: ${requiredLength})`,
  maxlength: (name: string, { requiredLength }: { requiredLength: number, actualLength: number }) => `Field ${name} is too long (max: ${requiredLength})`,
  base: (name: string) => `Field ${name} has error`,
}
export const getErrors = <T extends Record<string, { errors?: Record<string, unknown> | null }>>(controls: T) => {
    const errors: Record<string, string[]> = {}
    Object.keys(controls).forEach((formKey) => {
      const control = controls[formKey as keyof typeof controls]
      const controlErrors = control.errors
      if (controlErrors) {
        errors[formKey] = []
        Object.keys(controlErrors).forEach((controlKey: string) => {
          const errorData = controlErrors[controlKey] as { requiredLength: number, actualLength: number }
          const errorMethod = errorsMethods[controlKey as keyof typeof errorsMethods] ?? errorsMethods.base
          errors[formKey].push((errorMethod)(formKey, errorData))
        })
      }
    });
    return errors
  }
