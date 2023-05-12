import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm !: FormGroup
  constructor(private formBuilder: FormBuilder,
    private toastService: NgToastService,
    private apiService: ApiService) { }
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      loginId: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
      emailId: new FormControl('', [Validators.required, Validators.email]),
      contactNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
      matchPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    })
  }
  doSignup() {

  }
}