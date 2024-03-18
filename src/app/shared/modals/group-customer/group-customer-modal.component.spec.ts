import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCustomerModalComponent } from './group-customer-modal.component';

describe('CustomerInfoModalComponent', () => {
  let component: GroupCustomerModalComponent;
  let fixture: ComponentFixture<GroupCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupCustomerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
