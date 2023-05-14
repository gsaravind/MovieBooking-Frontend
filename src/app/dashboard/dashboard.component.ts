import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Movie } from '../model/Movie';
import { NgToastService } from 'ng-angular-popup';
import { MatDialog } from '@angular/material/dialog';
import { AddTicketDialogComponent } from '../dialog/add-ticket-dialog/add-ticket-dialog.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private apiService: ApiService,
    private toastService: NgToastService,
    private dialog: MatDialog,
    public cookieService: CookieService) { }
  ngOnInit(): void {
    if(this.cookieService.get('loggedIn') == 'Yes'){
      this.disabledBuyTicket = false
    }
    this.movies = [];
    if (this.loaded == false) {
      this.loaded = true;
      this.getAllMovies();
    }
  }
  movies!: Movie[];
  loaded: boolean = false;
  disabledBuyTicket: boolean = true;

  searchBykeyword(searchKeyword: string) {
    if (searchKeyword == "") {
      this.getAllMovies();
      return;
    }
    console.log(searchKeyword)
    this.apiService.searchMovie(searchKeyword).subscribe({
      next: (res) => {
        console.log(res);
        this.movies = [];
        res.forEach((ele: { movieIdentity: { movieName: string; theatreName: string; }; noOfTickets: number; }) =>
          this.movies.push(
            new Movie(ele.movieIdentity.movieName, ele.movieIdentity.theatreName, ele.noOfTickets)
          )
        );
        this.loaded = false;
      },
      error: (res) => {
        this.toastService.warning({
          detail: "Movies not found",
          summary: res.error.message,
          duration: 3000
        })
      }
    })
  }
  getAllMovies() {
    this.apiService.getAllMovies().subscribe({
      next: (res) => {
        this.movies = []
        console.log(res);
        res.forEach((ele: { movieIdentity: { movieName: string; theatreName: string; }; noOfTickets: number; }) =>
          this.movies.push(
            new Movie(ele.movieIdentity.movieName, ele.movieIdentity.theatreName, ele.noOfTickets)
          )
        );
        console.log(this.movies)
      },
      error: (res) => {
        console.log(res)
      }
    })
  }
  openAddTickets(val: Movie) {
    this.dialog.open(AddTicketDialogComponent, {
      width: '35%',
      data: val
    })
  }
}
