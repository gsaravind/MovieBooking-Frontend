import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let toastService: jasmine.SpyObj<NgToastService>;
  let cookieService: jasmine.SpyObj<CookieService>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: Router;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['forgotPassword']);
    const toastServiceSpy = jasmine.createSpyObj('NgToastService', ['success', 'warning']);
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get', 'set']);

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [MatStepperModule, MatFormFieldModule, ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: ApiService, useValue: apiServiceSpy },
      { provide: NgToastService, useValue: toastServiceSpy },
      { provide: CookieService, useValue: cookieServiceSpy },
        FormBuilder]
    });
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    component.loginIdNameForm = formBuilder.group({
      loginId: new FormControl('', Validators.required),
      firstName: '',
      lastName: ''
    });
    component.mailContactForm = formBuilder.group({
      emailId: '',
      contactNumber: ''
    });
    component.passwordForm = formBuilder.group({
      password: '',
      matchPassword: ''
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component using ngOnInit', () => {
    spyOn(formBuilder, 'group')
    component.ngOnInit();
    expect(formBuilder.group).toHaveBeenCalledTimes(3);
  });

  it('should call doChangePassword but fail due to incorrect data provided', () => {
    component.loginIdNameForm.addValidators([Validators.required]);
    component.doChangePassword();
    expect(toastService.warning).toHaveBeenCalledWith({
      detail: "Error",
      summary: "Provided data is invalid",
      duration: 3000
    })
    expect(toastService.warning).toHaveBeenCalledTimes(1);
  })

  it('should call doChangePassword but fail due to confirm password not matched with password', () => {
    component.loginIdNameForm.setValue({ loginId: 'msaraswat', firstName: 'Manmohan', lastName: 'Saraswat' });
    component.mailContactForm.setValue({ emailId: 'manmohan@gmail.com', contactNumber: '9358342345' });
    component.passwordForm.setValue({ password: '12345678', matchPassword: '87654321' });
    component.doChangePassword();
    expect(toastService.warning).toHaveBeenCalledWith({
      detail: "Error",
      summary: "Confirm password not matched",
      duration: 3000
    })
    expect(toastService.warning).toHaveBeenCalledTimes(1);
  })

  it('should call doChangePassword and change password without any error', () => {
    component.loginIdNameForm.setValue({ loginId: 'msaraswat', firstName: 'Manmohan', lastName: 'Saraswat' });
    component.mailContactForm.setValue({ emailId: 'manmohan@gmail.com', contactNumber: '9358342345' });
    component.passwordForm.setValue({ password: '12345678', matchPassword: '12345678' });
    apiService.forgotPassword.and.returnValue(of(null));
    spyOn(router, 'navigate');
    component.doChangePassword();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(toastService.success).toHaveBeenCalledWith({
      detail: 'Success',
      summary: 'Password updated successfully',
      duration: 3000,
    });
    expect(toastService.warning).not.toHaveBeenCalled();
  });

  it('should call doChangePassword and do not change password because details not matched', () => {
    component.loginIdNameForm.setValue({ loginId: 'msaraswat', firstName: 'Manmohan', lastName: 'Saraswat' });
    component.mailContactForm.setValue({ emailId: 'manmohan@gmail.com', contactNumber: '9358342345' });
    component.passwordForm.setValue({ password: '12345678', matchPassword: '12345678' });
    apiService.forgotPassword.and.returnValue(throwError({ error: 'User authentication failed' }));
    component.doChangePassword();
    expect(toastService.warning).toHaveBeenCalledTimes(1);
    expect(toastService.success).not.toHaveBeenCalled();
  });
});
