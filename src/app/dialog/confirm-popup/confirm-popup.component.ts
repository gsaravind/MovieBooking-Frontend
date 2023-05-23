import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { Movie } from 'src/app/model/Movie';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.css']
})
export class ConfirmPopupComponent implements OnInit {
  movie!: Movie
  constructor(private apiService: ApiService,
    private toastService: NgToastService,
    private dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public addTickets: any) { }

  ngOnInit(): void {
    if (this.addTickets) {
      this.movie = this.addTickets
      console.log(this.addTickets)
    }
  }

  updateTicketsStatus() {
    if (this.movie) {
      this.apiService.authenticateAdmin().subscribe({
        next: (res) => {
          this.apiService.updateTicketStatus(this.movie).subscribe({
            next: (res) => {
              this.toastService.success({
                detail: "Success",
                summary: res.message,
                duration: 3000
              })
              this.dialogRef.close("done");
            },
            error: (res) => console.log(res)
          })
        },
        error: (res) => {
          this.toastService.warning({
            detail: "Error",
            summary: "You are not authorized as Admin",
            duration: 3000
          })
          this.dialogRef.close("done");
        }
      })
    }

  }
}
