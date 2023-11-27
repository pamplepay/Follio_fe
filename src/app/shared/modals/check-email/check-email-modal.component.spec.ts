import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckEmailModalComponent } from './check-email-modal.component';

describe('CheckEmailModalComponent', () => {
  let component: CheckEmailModalComponent;
  let fixture: ComponentFixture<CheckEmailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckEmailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
