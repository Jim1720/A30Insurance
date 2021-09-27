import { AfterViewInit, Component, ElementRef, ViewChild  } from '@angular/core';

@Component({
  selector: 'app-classic',
  templateUrl: './classic.component.html',
  styleUrls: ['./classic.component.css']
}) 

export class ClassicComponent implements AfterViewInit {    
  
  @ViewChild("carousel", { static:false} ) carousel! : ElementRef<any>;

  ngAfterViewInit() { 

      // ref: 
      // https://stackoverflow.com/questions/66506091/bootstrap-carousel-does-not-auto-slide-when-routing-back-in-angular
      // carousel was not starting until page refreshed. 

      setInterval(() => {
        this.carousel.nativeElement.click();
      }, 10000); 

  }; 
}
