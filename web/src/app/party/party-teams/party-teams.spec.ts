import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyTeams } from './party-teams';

describe('PartyTeams', () => {
  let component: PartyTeams;
  let fixture: ComponentFixture<PartyTeams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyTeams],
    }).compileComponents();

    fixture = TestBed.createComponent(PartyTeams);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
