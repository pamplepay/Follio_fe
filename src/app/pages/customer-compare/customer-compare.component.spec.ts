import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCompareComponent } from './customer-compare.component';

describe('CustomerAnalysisComponent', () => {
  let component: CustomerCompareComponent;
  let fixture: ComponentFixture<CustomerCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCompareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
