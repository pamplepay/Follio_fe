import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LayoutFooterComponent } from './layout-footer.component';

describe('LayoutFooterComponent', () => {
  let component: LayoutFooterComponent;
  let fixture: ComponentFixture<LayoutFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
