import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
 
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms'

import { AboutComponent } from './about/about.component'
import { ClaimComponent } from './claim/claim.component'
import { HistoryComponent } from './history/history.component';
import { RegisterComponent } from './register/register.component'
import { SigninComponent } from './signin/signin.component'
import { SplashComponent } from './splash/splash.component'
import { UpdateComponent } from './update/update.component' 

import { CustomerService} from './customer.service' 
import { StorageService } from './storage.service'
import { RouterModule, Routes } from '@angular/router';
import { SignOutComponent } from './sign-out/sign-out.component';

import { HttpClientModule } from '@angular/common/http';
import { ClassicComponent } from './classic/classic.component';
import { AdminComponent } from './admin/admin.component';
import { CustListComponent } from './cust-list/cust-list.component';  
import { ResetComponent } from './reset/reset.component';
import { AdmActionComponent } from './adm-action/adm-action.component'; 
import { AppService } from './app.service';
import { ClaimService } from './claim.service';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import { HubComponentComponent } from './hub-component/hub-component.component';
import { InfoComponent } from './info/info.component'; 
import PlanService from './plan.service';
 
const appRoutes: Routes = [

  {
        path: 'splash' , component: SplashComponent
  }, 
  {
        path: 'register', component: RegisterComponent
  },
  {
      path: 'select-plan', component:  SelectPlanComponent
  },
  {
       path: 'hub', component:  HubComponentComponent
  },
  {
        path: 'signin', component: SigninComponent
  },
  {
        path: 'update', component: UpdateComponent
  },
  {
        path: 'claim', component: ClaimComponent
  }, 
  {
        path: 'history', component: HistoryComponent
  },
  {
        path: 'signout', component: SplashComponent
  },
  {
        path: 'about', component: AboutComponent
  },
  {
      path: 'admin', component: AdminComponent
  },
  {
      path: 'custlist', component: CustListComponent
  },
  { 
      path: 'reset', component: ResetComponent
  }, 
  { 
      path: 'classic', component: ClassicComponent
  }, 
  { 
      path: 'admaction', component: AdmActionComponent
  }, 
  { 
      path: 'info', component: InfoComponent
  }, 
  {
      path: '**', component: SplashComponent
  } 

]

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ClaimComponent,
    HistoryComponent,
    RegisterComponent,
    SigninComponent,
    SplashComponent,
    UpdateComponent,
    RegisterComponent,
    SignOutComponent,
    ClassicComponent,
    AdminComponent,
    CustListComponent,  
    ResetComponent,
    AdmActionComponent,
    SelectPlanComponent,
    HubComponentComponent,
    InfoComponent 
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }), 
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule 
  ],
  providers: [CustomerService,
              ClaimService,
              PlanService,
              StorageService,
              AppService], 
  bootstrap: [AppComponent]
})
export class AppModule { }
