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
  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastService: NgToastService,
    private dialogRef: MatDialogRef<AddTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public addTickets: any) { }
  ngOnInit(): void {
    if (this.addTickets) {
      this.movie = this.addTickets;
    }
  }
}
