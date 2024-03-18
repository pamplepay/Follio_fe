import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceIdComponent } from './insurance-id.component';

describe('InsuranceIdComponent', () => {
  let component: InsuranceIdComponent;
  let fixture: ComponentFixture<InsuranceIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
