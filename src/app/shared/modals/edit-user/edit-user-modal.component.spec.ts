import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditUserModalComponent } from './edit-user-modal.component';

describe('UserDetailModalComponent', () => {
  let component: EditUserModalComponent;
  let fixture: ComponentFixture<EditUserModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
