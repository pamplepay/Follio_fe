import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseHistoryModalComponent } from './case-history-modal.component';

describe('CaseHistoryModalComponent', () => {
  let component: CaseHistoryModalComponent;
  let fixture: ComponentFixture<CaseHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
