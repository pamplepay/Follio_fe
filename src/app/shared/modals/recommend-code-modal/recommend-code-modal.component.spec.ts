import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendCodeModalComponent } from './recommend-code-modal.component';

describe('RecommendCodeModalComponent', () => {
  let component: RecommendCodeModalComponent;
  let fixture: ComponentFixture<RecommendCodeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendCodeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
