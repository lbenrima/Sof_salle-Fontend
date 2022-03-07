import { TestBed, inject } from '@angular/core/testing';

import { RoomCalendarService } from './room-calendar.service';

describe('RoomCalendarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomCalendarService]
    });
  });

  it('should be created', inject([RoomCalendarService], (service: RoomCalendarService) => {
    expect(service).toBeTruthy();
  }));
});
