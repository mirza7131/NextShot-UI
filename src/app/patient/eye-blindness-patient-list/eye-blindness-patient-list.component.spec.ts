import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeBlindnessPatientListComponent } from './eye-blindness-patient-list.component';

describe('EyeBlindnessPatientListComponent', () => {
  let component: EyeBlindnessPatientListComponent;
  let fixture: ComponentFixture<EyeBlindnessPatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EyeBlindnessPatientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EyeBlindnessPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
