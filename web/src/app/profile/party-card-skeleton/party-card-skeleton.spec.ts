import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCardSkeleton } from './party-card-skeleton';

describe('PartyCardSkeleton', () => {
  let component: PartyCardSkeleton;
  let fixture: ComponentFixture<PartyCardSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyCardSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(PartyCardSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
