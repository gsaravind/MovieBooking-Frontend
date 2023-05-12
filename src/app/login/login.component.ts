import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = false;
  loginForm!: FormGroup
  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastService: NgToastService) { }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      loginId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  doLogin() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(
        {
          next: (res) => {
            console.log(res);
            this.toastService.success({
              detail: "Login Success",
              summary: "You are logged in as " + res.firstName,
              duration: 3000
            })
          },
          error: (res) => {
            console.log(res);
            this.toastService.warning({
              detail: "Login Failed",
              summary: res.error.message,
              duration: 3000
            })
          }
        }
      )
    }
  }
}
