import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../service/api.service';
import { User } from '../model/User';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm !: FormGroup
  user !: User;
  constructor(private formBuilder: FormBuilder,
    private toastService: NgToastService,
    private apiService: ApiService,
    private router: Router,
    private cookieService: CookieService) { }
  ngOnInit(): void {
    if(this.cookieService.get("loggedIn") == "Yes"){
      this.router.navigate(['/dashboard']);
    }
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
    if (this.signupForm.valid) {
      this.user = new User(this.signupForm.value.loginId, this.signupForm.value.firstName, this.signupForm.value.lastName, this.signupForm.value.emailId, this.signupForm.value.contactNumber, this.signupForm.value.password);
      if (this.user.password != this.signupForm.value.matchPassword) {
        this.toastService.warning({
          detail: "Error",
          summary: "Confirm password not matched",
          duration: 3000
        })
      } else {
        this.apiService.register(this.user).subscribe(
          {
            next: (res) => {
              console.log(res);

              this.toastService.success({
                detail: "Registration Success",
                summary: "User registered successfully",
                duration: 3000
              })
            },
            error: (res) => {
              console.log(res);
              this.toastService.warning({
                detail: "Error",
                summary: res.error.message,
                duration: 3000
              })
            }
          }
        )
      }
    }
  }
}