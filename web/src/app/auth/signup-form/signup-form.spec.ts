import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { passwordMatchValidator, SignUpForm } from './signup-form';

describe('AuthForm', () => {
  let component: SignUpForm;
  let fixture: ComponentFixture<SignUpForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should report a password mismatch on the form group', () => {
    const form = new FormGroup({
      password: new FormControl('password-1'),
      passwordConfirmation: new FormControl('password-2'),
    }, {
      validators: passwordMatchValidator,
    });

    expect(form.hasError('passwordMismatch')).toBe(true);
    expect(form.getError('passwordMismatch')).toBe('Passwords are not the same');
  });

  it('should accept matching passwords', () => {
    const form = new FormGroup({
      password: new FormControl('password-1'),
      passwordConfirmation: new FormControl('password-1'),
    }, {
      validators: passwordMatchValidator,
    });

    expect(form.hasError('passwordMismatch')).toBe(false);
  });
});
