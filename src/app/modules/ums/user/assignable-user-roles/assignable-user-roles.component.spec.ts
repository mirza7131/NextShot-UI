import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignableUserRolesComponent } from './assignable-user-roles.component';

describe('AssignableUserRolesComponent', () => {
  let component: AssignableUserRolesComponent;
  let fixture: ComponentFixture<AssignableUserRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignableUserRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignableUserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
