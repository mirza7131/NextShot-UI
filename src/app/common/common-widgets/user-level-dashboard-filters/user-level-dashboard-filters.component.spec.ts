import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLevelDashboardFiltersComponent } from './user-level-dashboard-filters.component';

describe('UserLevelDashboardFiltersComponent', () => {
  let component: UserLevelDashboardFiltersComponent;
  let fixture: ComponentFixture<UserLevelDashboardFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLevelDashboardFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLevelDashboardFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
