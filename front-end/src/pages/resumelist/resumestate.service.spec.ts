import { TestBed } from '@angular/core/testing';

import { ResumestateService } from './resumestate.service';

describe('ResumestateService', () => {
  let service: ResumestateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumestateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
