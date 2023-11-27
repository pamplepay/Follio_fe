import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LayoutToastComponent } from './layout-toast.component';

describe('LayoutToastComponent', () => {
  let component: LayoutToastComponent;
  let fixture: ComponentFixture<LayoutToastComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
