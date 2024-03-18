import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAgreeComponent } from './customer-agree.component';

describe('CustomerAgreeComponent', () => {
  let component: CustomerAgreeComponent;
  let fixture: ComponentFixture<CustomerAgreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAgreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAgreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
