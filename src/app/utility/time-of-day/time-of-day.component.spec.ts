import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOfDayComponent } from './time-of-day.component';

describe('TimeOfDayComponent', () => {
  let component: TimeOfDayComponent;
  let fixture: ComponentFixture<TimeOfDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeOfDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeOfDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
