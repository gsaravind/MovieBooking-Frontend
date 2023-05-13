import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Movie } from 'src/app/model/Movie';
@Component({
  selector: 'app-add-ticket-dialog',
  templateUrl: './add-ticket-dialog.component.html',
  styleUrls: ['./add-ticket-dialog.component.css']
})
export class AddTicketDialogComponent implements OnInit {
  addTicketsForm !: FormGroup
  actionBtn: string = "Save";
  movie!: Movie
  seats!: string[][]
  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastService: NgToastService,
    private dialogRef: MatDialogRef<AddTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public addTickets: any) { }
  ngOnInit(): void {
    this.seats = []
    this.seats.push(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8']);
    this.seats.push(['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8']);
    this.seats.push(['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']);
    this.seats.push(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8']);
    this.seats.push(['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8']);
    this.seats.push(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8']);
    if (this.addTickets) {
      this.movie = this.addTickets;
    }
  }
}
