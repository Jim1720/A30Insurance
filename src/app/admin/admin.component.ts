import { Component } from '@angular/core'; 
import { Router } from '@angular/router'; 


import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

import EnvironmentService from '../EnvironmentService'; 
import AppService from '../app.service';
import { TokenService } from '../token.service';  


const httpOptions = {
  headers: new HttpHeaders({ 'content-Type': 'application/json' })  
};

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent   {


  admId: string = '';
  admPassword: string = '';
  message: string = '';
  port: string = this.appService.getApiUrl();

  constructor(private http: HttpClient,
              private router: Router,
              private appService: AppService,
              private tokenService: TokenService,
              private environmentService: EnvironmentService) { }

  
  onSubmit() {

       debugger;
       var closureThis = this;
       this.verifyAdminLogin(this.admId, this.admPassword).subscribe(

          // returns object with several properties
          // { PassEdit: true, EditMessage: '', Token: ''} 

          (ao:any) => {


                debugger; 
                // check edit results / json object returned based on content type.
                if(ao.Status === "Unsuccessful") {

                  closureThis.message = ao.Message;
                  return;
                }

                // edit passed change the token part of the A45Object to an object.
                var token = JSON.parse(ao.Token); 
                closureThis.tokenService.setToken(token);

                // url protect
                this.appService.signInAdmin();
 
                var destinationScreen = 'admaction';
                let whereTo = '/' + destinationScreen;
                this.router.navigate([whereTo]);  


          },
          (Err) => {

                closureThis.message = Err.message;

          } 

       );  
  }

  public verifyAdminLogin(id:string,pw:string) : Observable<string> {
  
      // IE 11 var send = `id=${id}&pw=${pw}`;
      var send = 'id=' + id + '&pw=' + pw;
      const url: string = this.port + 'adminSignin?' + send;
      return this.http.get<string>(url, httpOptions);  
  }

  
}
