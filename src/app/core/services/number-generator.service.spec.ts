import { TestBed } from '@angular/core/testing';

import { NumberGeneratorService } from './number-generator.service';

describe('NumberGeneratorService', () => {
  let service: NumberGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumberGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have the length of 43', () => {
    const result = service.getRandonNumber(43);
    expect(result.length).toEqual(43);
  });

  it('should have the length of 0', () => {
    const result = service.getRandonNumber(0);
    expect(result.length).toEqual(0);
  });
});
