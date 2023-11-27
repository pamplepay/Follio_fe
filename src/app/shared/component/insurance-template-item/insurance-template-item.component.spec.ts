import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceTemplateItemComponent } from './insurance-template-item.component';

describe('InsuranceTemplateItemComponent', () => {
  let component: InsuranceTemplateItemComponent;
  let fixture: ComponentFixture<InsuranceTemplateItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceTemplateItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceTemplateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
