import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<NgToastService>;
  let cookieService: jasmine.SpyObj<CookieService>;
  let router: Router;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['login', 'authenticateAdmin', 'authenticateUser']);
    const toastServiceSpy = jasmine.createSpyObj('NgToastService', ['success', 'warning']);
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get', 'set']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, MatCardModule, MatFormFieldModule, MatIconModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: NgToastService, useValue: toastServiceSpy },
        { provide: CookieService, useValue: cookieServiceSpy },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    component.loginForm = formBuilder.group({
      loginId: '',
      password: ''
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

  it('should display success toast and navigate to dashboard upon successful login', () => {
    const mockResponse = {
      loginId: 'user123',
      jwtToken: 'jwtToken123',
      firstName: 'Manmohan',
      emailId: 'manmohan@example.com',
      contactNumber: '1234567890',
      lastName: 'Manmohan',
    };
    apiService.login.and.returnValue(of(mockResponse));
    apiService.authenticateAdmin.and.returnValue(of(null));
    apiService.authenticateUser.and.returnValue(of(null));
    component.loginForm.setValue({ loginId: 'user123', password: 'password123' });
    spyOn(router, 'navigate');
    component.doLogin();
    expect(apiService.login).toHaveBeenCalledWith({ loginId: 'user123', password: 'password123' });
    expect(cookieService.set).toHaveBeenCalledTimes(8);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(toastService.success).toHaveBeenCalled();
  });

  it('should display success toast and navigate to dashboard upon successful login but as user', () => {
    const mockResponse = {
      loginId: 'user123',
      jwtToken: 'jwtToken123',
      firstName: 'Manmohan',
      emailId: 'manmohan@gmail.com',
      contactNumber: '1234567890',
      lastName: 'Saraswat',
    };
    apiService.login.and.returnValue(of(mockResponse));
    apiService.authenticateAdmin.and.returnValue(throwError({ error: 'Admin authentication failed' }));
    apiService.authenticateUser.and.returnValue(of(null));
    spyOn(router, 'navigate');
    component.loginForm.setValue({ loginId: 'user123', password: 'password123' });
    component.doLogin();

    expect(apiService.login).toHaveBeenCalledWith({ loginId: 'user123', password: 'password123' });
    expect(cookieService.set).toHaveBeenCalledTimes(8);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(toastService.success).toHaveBeenCalledWith({
      detail: 'Login Success',
      summary: 'You are logged in as Manmohan',
      duration: 3000,
    });
    expect(toastService.warning).not.toHaveBeenCalled();
  });

  it('should display success toast and navigate to dashboard upon successful login but admin & user authorization failed', () => {
    const mockResponse = {
      loginId: 'user123',
      jwtToken: 'jwtToken123',
      firstName: 'Manmohan',
      emailId: 'manmohan@gmail.com',
      contactNumber: '1234567890',
      lastName: 'Saraswat',
    };
    apiService.login.and.returnValue(of(mockResponse));
    apiService.authenticateAdmin.and.returnValue(throwError({ error: 'Admin authentication failed' }));
    apiService.authenticateUser.and.returnValue(throwError({ error: 'User authentication failed' }));
    spyOn(router, 'navigate');
    component.loginForm.setValue({ loginId: 'user123', password: 'password123' });
    component.doLogin();

    expect(apiService.login).toHaveBeenCalledWith({ loginId: 'user123', password: 'password123' });
    expect(cookieService.set).toHaveBeenCalledTimes(7);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(toastService.success).toHaveBeenCalledWith({
      detail: 'Login Success',
      summary: 'You are logged in as Manmohan',
      duration: 3000,
    });
    expect(toastService.warning).not.toHaveBeenCalled();
  });


  it('should display warning toast upon failed login', () => {
    const mockResponse = { error: { message: 'Invalid credentials' } };
    apiService.login.and.returnValue(throwError(mockResponse));
    component.loginForm.setValue({
      loginId:
        'user123', password: 'password123'
    });
    spyOn(router, 'navigateByUrl');
    component.doLogin();
    expect(apiService.login).toHaveBeenCalledWith({ loginId: 'user123', password: 'password123' });
    expect(toastService.warning).toHaveBeenCalled();
  });

  it('should navigate to forgot password page', () => {
    spyOn(router, 'navigate');
    component.doNavigateForgotPage();
    expect(router.navigate).toHaveBeenCalledWith(['forgotpassword']);
  });
});