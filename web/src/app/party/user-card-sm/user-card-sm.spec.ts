import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardSm } from './user-card-sm';

describe('UserCardSm', () => {
  let component: UserCardSm;
  let fixture: ComponentFixture<UserCardSm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardSm],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardSm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
