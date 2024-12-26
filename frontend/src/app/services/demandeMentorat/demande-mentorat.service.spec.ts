import { TestBed } from '@angular/core/testing';

import { DemandeMentoratService } from './demande-mentorat.service';

describe('DemandeMentoratService', () => {
  let service: DemandeMentoratService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeMentoratService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
