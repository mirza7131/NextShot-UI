import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbPatientListComponent } from './tb-patient-list.component';

describe('TbPatientListComponent', () => {
  let component: TbPatientListComponent;
  let fixture: ComponentFixture<TbPatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TbPatientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TbPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
