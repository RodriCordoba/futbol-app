import { TestBed } from '@angular/core/testing';

import { Matchmaker } from './matchmaker';

describe('Matchmaker', () => {
  let service: Matchmaker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Matchmaker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
