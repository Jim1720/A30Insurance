import { Component, OnInit } from '@angular/core';
import { AppService} from '../app.service';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent implements OnInit {

  constructor(private appService: AppService) { }

  ngOnInit() { 
     
    this.appService.signAction("signout","");

  }

}
