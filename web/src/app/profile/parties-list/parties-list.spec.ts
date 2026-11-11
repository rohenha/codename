import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesList } from './parties-list';

describe('PartiesList', () => {
  let component: PartiesList;
  let fixture: ComponentFixture<PartiesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartiesList],
    }).compileComponents();

    fixture = TestBed.createComponent(PartiesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
