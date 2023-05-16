import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { ApiService } from '../service/api.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  ngOnInit(): void {
    this.loginIdNameForm = this.formBuilder.group({
      loginId: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
    })
    this.mailContactForm = this.formBuilder.group({
      emailId: new FormControl('', [Validators.required, Validators.email]),
      contactNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]),
    })
    this.passwordForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
      matchPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)])
    })
  }
  loginIdNameForm !: FormGroup
  mailContactForm !: FormGroup
  passwordForm !: FormGroup
  user!: User
  constructor(private formBuilder: FormBuilder, private toastService: NgToastService, private apiService: ApiService,
    private router: Router) { }

  doChangePassword() {
    if (this.loginIdNameForm.valid && this.mailContactForm.valid && this.passwordForm.valid) {
      this.user = new User(this.loginIdNameForm.value.loginId, this.loginIdNameForm.value.firstName, this.loginIdNameForm.value.lastName, this.mailContactForm.value.emailId, this.mailContactForm.value.contactNumber, this.passwordForm.value.password);
      if (this.user.password != this.passwordForm.value.matchPassword) {
        this.toastService.warning({
          detail: "Error",
          summary: "Confirm password not matched",
          duration: 3000
        })
      } else {
        this.apiService.forgotPassword(this.user).subscribe({
          next: (res) => {
            this.router.navigate(["/login"]);
            this.toastService.success({
              detail: "Success",
              summary: "Password updated successfully",
              duration: 3000
            })
          }, error: (res) => {
            this.toastService.warning({
              detail: "Failure",
              summary: res.error.message,
              duration: 3000
            })
          }
        })
      }
    } else {
      this.toastService.warning({
        detail: "Error",
        summary: "Provided data is invalid",
        duration: 3000
      })
    }
  }
}
