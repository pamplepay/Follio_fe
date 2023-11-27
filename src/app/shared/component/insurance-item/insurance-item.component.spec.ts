import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceItemComponent } from './insurance-item.component';

describe('InsuranceItemComponent', () => {
  let component: InsuranceItemComponent;
  let fixture: ComponentFixture<InsuranceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
