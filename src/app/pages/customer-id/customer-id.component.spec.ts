import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerIdComponent } from './customer-id.component';

describe('CustomerIdComponent', () => {
  let component: CustomerIdComponent;
  let fixture: ComponentFixture<CustomerIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
