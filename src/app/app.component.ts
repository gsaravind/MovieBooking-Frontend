import { Component, OnInit } from '@angular/core';
import { ApiService } from './service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'moviebooking-frontend';
  constructor(public apiService: ApiService,
    private toastService: NgToastService,
    private router: Router,
    public cookieService: CookieService) { }
  ngOnInit(): void {
  }

  doLogout(){
    this.cookieService.deleteAll();
    this.toastService.success({
      detail: "Logout Success",
      summary: "You are logged out successfully",
      duration: 3000
    });
  }
}
