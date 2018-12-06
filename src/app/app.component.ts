import { Component, OnInit } from '@angular/core';
import { HttpStatusService } from './core/services/httpStatusService';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  loading = true;
  background = `url(${environment.alias}/assets/loading.gif) 50% 50% no-repeat #fff`

  constructor(private httpStatusService :HttpStatusService) {
  }

  ngOnInit() {
    this.httpStatusService.getHttpStatus().subscribe(status => {
      this.loading = status;
    })
  }

  onActivate(event) {
    window.scroll(0, 0);    
  }
}
