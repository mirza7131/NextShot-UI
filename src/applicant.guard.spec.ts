import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { applicantGuard } from './applicant.guard';

describe('applicantGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => applicantGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
