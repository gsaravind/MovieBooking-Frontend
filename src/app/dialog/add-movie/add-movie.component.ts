import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
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
    private toastService: NgToastService,
    private cookieService: CookieService,) { }
  addMovieForm !: FormGroup
  ngOnInit(): void {
    this.addMovieForm = this.formBuilder.group({
      movieName: new FormControl('', [Validators.required]),
      theatreName: new FormControl('', [Validators.required])
    })
  }
  addMovie() {

  }
}
