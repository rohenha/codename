import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInForm } from './signin-form';

describe('AuthForm', () => {
  let component: SignInForm;
  let fixture: ComponentFixture<SignInForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
