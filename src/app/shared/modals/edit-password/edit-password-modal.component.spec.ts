import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPasswordModalComponent } from './edit-password-modal.component';

describe('EditPasswordComponent', () => {
  let component: EditPasswordModalComponent;
  let fixture: ComponentFixture<EditPasswordModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPasswordModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
