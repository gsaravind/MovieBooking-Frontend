import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ApiService } from './service/api.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<NgToastService>;
  let router: jasmine.SpyObj<Router>;
  let cookieService: jasmine.SpyObj<CookieService>;

  beforeEach(async () => {
    const apiServiceMock = jasmine.createSpyObj('ApiService', ['']);
    const toastServiceMock = jasmine.createSpyObj<NgToastService>(['success', 'warning']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const cookieServiceMock = jasmine.createSpyObj('CookieService', ['get', 'deleteAll']);

    await TestBed.configureTestingModule({
      imports: [MatToolbarModule, MatIconModule, RouterTestingModule, NgToastModule],
      declarations: [AppComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: NgToastService, useValue: toastServiceMock },
        { provide: CookieService, useValue: cookieServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
  });


  it('should call deleteAll method of CookieService and display success toast on logout', () => {
    component.doLogout();
    expect(cookieService.deleteAll).toHaveBeenCalled();
    expect(toastService.success).toHaveBeenCalledWith({
      detail: 'Logout Success',
      summary: 'You are logged out successfully',
      duration: 3000
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(app).toBeTruthy();
  });

  it(`should have as title 'moviebooking-frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('moviebooking-frontend');
  });
});