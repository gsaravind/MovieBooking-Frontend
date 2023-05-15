import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Movie } from 'src/app/model/Movie';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.css']
})
export class ConfirmPopupComponent implements OnInit {
  movie!: Movie
  constructor(private dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public addTickets: any) { }

    ngOnInit(): void {
      if(this.addTickets) {
        this.movie = this.addTickets
        console.log(this.addTickets)
      }
    }
  
}
