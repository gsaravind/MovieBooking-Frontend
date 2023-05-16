import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CookieService } from 'ngx-cookie-service';
import { MatCardModule } from '@angular/material/card';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<NgToastService>;
  let cookieService: jasmine.SpyObj<CookieService>;
  let router: Router;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get']);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['register']);
    const toastServiceSpy = jasmine.createSpyObj('NgToastService', ['success', 'warning']);
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, MatCardModule, MatFormFieldModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: NgToastService, useValue: toastServiceSpy },
        { provide: CookieService, useValue: cookieServiceSpy },
        FormBuilder,
      ],
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    component.signupForm = formBuilder.group({
      loginId: '',
      firstName: '',
      lastName: '',
      emailId: '',
      contactNumber: '',
      password: '',
      matchPassword: ''
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard if user is already logged in', () => {
    cookieService.get.and.returnValue('Yes');
    spyOn(router, 'navigate');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should display success toast and navigate to dashboard upon successful register', () => {
    const mockResponse = { message: "User registered successfully" }
    apiService.register.and.returnValue(of(mockResponse));
    component.signupForm.setValue({
      loginId: 'manmohan@123',
      firstName: 'Manmohan',
      lastName: 'Saraswat',
      emailId: 'msaraswat@gmail.com',
      contactNumber: '9358342345',
      password: '12345678',
      matchPassword: '12345678'
    });
    spyOn(router, 'navigate');
    component.doSignup();
    expect(apiService.register).toHaveBeenCalledWith(jasmine.objectContaining({
      loginId: 'manmohan@123',
      firstName: 'Manmohan',
      lastName: 'Saraswat',
      emailId: 'msaraswat@gmail.com',
      contactNumber: '9358342345',
      password: '12345678'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(toastService.success).toHaveBeenCalled();
  });

  it('should display warning toast as the confirm password doesnot match with password', () => {
    component.signupForm.setValue({
      loginId: 'manmohan@123',
      firstName: 'Manmohan',
      lastName: 'Saraswat',
      emailId: 'msaraswat@gmail.com',
      contactNumber: '9358342345',
      password: '12345678',
      matchPassword: '87654321'
    });
    component.doSignup();
    expect(toastService.warning).toHaveBeenCalledTimes(1);
    expect(toastService.warning).toHaveBeenCalled();
  });

  it('should display warning toast as error was thrown because backend was unable to save user', () => {
    apiService.register.and.returnValue(throwError({ error: 'Unable to register user' }));
    component.signupForm.setValue({
      loginId: 'manmohan@123',
      firstName: 'Manmohan',
      lastName: 'Saraswat',
      emailId: 'msaraswat@gmail.com',
      contactNumber: '9358342345',
      password: '12345678',
      matchPassword: '12345678'
    });
    component.doSignup();
    expect(apiService.register).toHaveBeenCalledWith(jasmine.objectContaining({
      loginId: 'manmohan@123',
      firstName: 'Manmohan',
      lastName: 'Saraswat',
      emailId: 'msaraswat@gmail.com',
      contactNumber: '9358342345',
      password: '12345678'
    }));
    expect(toastService.warning).toHaveBeenCalledTimes(1);
    expect(toastService.warning).toHaveBeenCalled();
  });
});
