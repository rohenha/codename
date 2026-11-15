import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBadge } from './login-badge';

describe('LoginBadge', () => {
  let component: LoginBadge;
  let fixture: ComponentFixture<LoginBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
