import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicToastComponent } from './basic-toast.component';

describe('BasicToastComponent', () => {
  let component: BasicToastComponent;
  let fixture: ComponentFixture<BasicToastComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
