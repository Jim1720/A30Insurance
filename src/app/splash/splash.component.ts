import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

  friendlyDate: string = '';

  constructor() { }

  ngOnInit() {
    
    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd = d.getDate(); 
    let hh = d.getHours();
    let mi = d.getMinutes();
    let ss = d.getSeconds(); 
    let slash = '/';
    let monthLiteral = this.findMonth(d.getMonth());
    this.friendlyDate = monthLiteral + ' '  + dd + ' ' + yyyy + ' ' + hh + ':' + mi + ':' + ss;
  }
  findMonth(value : number) {

    var months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October','November','December'];
    return months[value];

  }

}
