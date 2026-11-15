import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCard } from './party-card';

describe('PartyCard', () => {
  let component: PartyCard;
  let fixture: ComponentFixture<PartyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PartyCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
