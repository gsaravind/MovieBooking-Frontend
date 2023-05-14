import { Component, Inject, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Movie } from 'src/app/model/Movie';
import { NewTicketsPojo } from 'src/app/model/NewTicketsPojo';
@Component({
  selector: 'app-add-ticket-dialog',
  templateUrl: './add-ticket-dialog.component.html',
  styleUrls: ['./add-ticket-dialog.component.css']
})
export class AddTicketDialogComponent implements OnInit, AfterViewInit {
  addTicketsForm !: FormGroup
  actionBtn: string = "Save";
  movie!: Movie;
  seats!: string[][];
  totPrice!: number;
  totSelectedSeats!: number;
  totSelectedSeatsID!: string[];
  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastService: NgToastService,
    private dialogRef: MatDialogRef<AddTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public addTickets: any) { }
  ngAfterViewInit(): void {
    if(this.addTickets) {
      this.movie.bookedSeats.forEach(ele => {
        document.getElementById(ele)?.classList.toggle("sold");
        console.log(ele);
      });
    }
  }
  ngOnInit(): void {
    this.seats = []
    this.totSelectedSeatsID = []
    this.seats.push(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8']);
    this.seats.push(['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8']);
    this.seats.push(['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']);
    this.seats.push(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8']);
    this.seats.push(['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8']);
    this.seats.push(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8']);
    if (this.addTickets) {
      this.movie = this.addTickets;
      console.log(this.movie)
      if(this.movie.bookedSeats != undefined) {
        this.movie.bookedSeats.forEach(ele => {
          document.getElementById(ele)?.classList.toggle("sold");
          console.log(ele);
        });
      }
    }
    this.totSelectedSeats = 0;
  }

  toggleSeat(e: any) {
    if (
      e.target.classList.contains("seat") &&
      !e.target.classList.contains("sold")
    ) {
      if (e.target.classList.contains("selected")) {
        this.totSelectedSeats--;
        this.totSelectedSeatsID = this.totSelectedSeatsID.filter(arrayItem => arrayItem !== e.target.id);
      }
      else {
        this.totSelectedSeats++;
        this.totSelectedSeatsID.push(e.target.id)
      }
      this.totPrice = 131 * this.totSelectedSeats;
      e.target.classList.toggle("selected");
    }
  }
  addMovieTickets() {
    if (this.totSelectedSeats > 0) {
      const ticketPojo = new NewTicketsPojo(this.movie.movieIdentity.movieName, this.movie.movieIdentity.theatreName, this.totSelectedSeats, this.totSelectedSeatsID);
      this.apiService.addMovieTickets(ticketPojo).subscribe({
        next: (res) => {
          console.log(res);
          this.toastService.success({
            detail: "Success",
            summary: res.message,
            duration: 3000
          })
        }, error: (res) => {
          console.log(res.status);
          if(res.status == 498) {
            this.toastService.warning({
              detail: "Error",
              summary: "Please login to book tickets",
              duration: 3000
            })
          }
        }
      })
    } else {
      this.toastService.warning({
        detail: "Error",
        summary: "Please select atleast one seat",
        duration: 3000
      })
    }
  }
}
