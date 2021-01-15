import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  newCustId: string = '';
  newPassword: string = '';
  message: string = '';

  constructor() { }

  onSubmit() {
    alert("missing code!");
  }

  ngOnInit() {
  }

}
