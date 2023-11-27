import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermModalComponent } from './term-modal.component';

describe('TermModalComponent', () => {
  let component: TermModalComponent;
  let fixture: ComponentFixture<TermModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
