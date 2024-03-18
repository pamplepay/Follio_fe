import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FindPwModalComponent } from './find-pw-modal.component';

describe('FindPwModalComponent', () => {
  let component: FindPwModalComponent;
  let fixture: ComponentFixture<FindPwModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FindPwModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPwModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
