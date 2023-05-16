import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { Movie } from 'src/app/model/Movie';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<AddMovieComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastService: NgToastService) { }
  addMovieForm !: FormGroup
  movie!: Movie;
  ngOnInit(): void {
    this.addMovieForm = this.formBuilder.group({
      movieName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      theatreName: new FormControl('', [Validators.required, Validators.minLength(3)])
    })
  }
  addMovie() {
    if (this.addMovieForm.valid) {
      this.apiService.authenticateAdmin().subscribe({
        next: (res) => {
          this.movie = new Movie(this.addMovieForm.value.movieName, this.addMovieForm.value.theatreName, 48, [], true);
          this.apiService.addMovie(this.movie).subscribe({
            next: (res) => {
              this.toastService.success({
                detail: "Success",
                summary: res.message,
                duration: 3000
              })
              this.dialogRef.close("done");
            },
            error: (res) => {
              this.toastService.warning({
                detail: "Error",
                summary: res.error.message,
                duration: 3000
              })
            }
          })
        },
        error: (res) => {
          this.toastService.warning({
            detail: "Error",
            summary: "You are not authorized as Admin",
            duration: 3000
          })
        }
      })
    }
  }
}
