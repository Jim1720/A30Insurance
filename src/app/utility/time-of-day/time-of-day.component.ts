import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-of-day',
  templateUrl: './time-of-day.component.html',
  styleUrls: ['./time-of-day.component.css']
})
export class TimeOfDayComponent implements OnInit {

  showTime: string = '';

  constructor() { }

  ngOnInit() {

    let timeOfDay = new Date();
    this.showTime = timeOfDay.toLocaleDateString();
    
  }

}
