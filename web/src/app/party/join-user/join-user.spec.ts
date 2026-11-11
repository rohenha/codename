import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinUser } from './join-user';

describe('JoinUser', () => {
  let component: JoinUser;
  let fixture: ComponentFixture<JoinUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinUser],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
