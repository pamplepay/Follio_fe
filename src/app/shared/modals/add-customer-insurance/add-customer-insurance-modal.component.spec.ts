import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerInsuranceModalComponent } from './add-customer-insurance-modal.component';

describe('CustomerInfoModalComponent', () => {
  let component: AddCustomerInsuranceModalComponent;
  let fixture: ComponentFixture<AddCustomerInsuranceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerInsuranceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerInsuranceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
