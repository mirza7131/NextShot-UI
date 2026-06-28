import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFingerprintComponent } from './patient-fingerprint.component';

describe('PatientFingerprintComponent', () => {
  let component: PatientFingerprintComponent;
  let fixture: ComponentFixture<PatientFingerprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFingerprintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientFingerprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
