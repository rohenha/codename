import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDashboard } from './party-dashboard';

describe('Party', () => {
  let component: PartyDashboard;
  let fixture: ComponentFixture<PartyDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(PartyDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
