import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { of, throwError } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<NgToastService>;
  let cookieService: jasmine.SpyObj<CookieService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj<ApiService>(['getAllMovies', 'searchMovie']);
    const toastServiceSpy = jasmine.createSpyObj<NgToastService>(['success', 'warning']);
    const dialogMockSpy = jasmine.createSpyObj<MatDialog>(['open']);
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get', 'set']);
    
    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, MatIconModule],
      declarations: [DashboardComponent],
      providers: [{ provide: ApiService, useValue: apiServiceSpy },
      { provide: NgToastService, useValue: toastServiceSpy },
      { provide: MatDialog, useValue: dialogMockSpy },
      { provide: CookieService, useValue: cookieServiceSpy },
    {provide: MatDialogRef, useValue: dialogRef}]
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties', () => {
    expect(component.movies).toBeUndefined();
    expect(component.loaded).toBeFalse();
    expect(component.disabledBuyTicket).toBeTrue();
  });

  it('should call ngOnInit and initialize each property', () => {
    apiService.getAllMovies.and.returnValue(throwError({}))
    component.ngOnInit();
    expect(component.movies).toBeDefined();
    expect(component.loaded).toBeTrue();
  })

  it('should call ngOnInit and initialize each property and enable user to buy ticket if the user is loggedIn', () => {
    cookieService.get.and.returnValue('Yes');
    apiService.getAllMovies.and.returnValue(throwError({}))
    component.ngOnInit();
    expect(component.movies).toBeDefined();
    expect(component.loaded).toBeTrue();
    expect(component.disabledBuyTicket).toBeFalse();
    expect(cookieService.get).toHaveBeenCalledWith('loggedIn');
    expect(cookieService.get).toHaveBeenCalledTimes(1);
  })

  it('should call getAllMovies and do not push the movies to the object as api returned error', () => {
    apiService.getAllMovies.and.returnValue(throwError({}))
    component.getAllMovies();
    expect(component.movies).toBeUndefined();
  })

  it('should call getAllMovies and api call success but the movie array is empty', () => {
    apiService.getAllMovies.and.returnValue(of([]))
    component.getAllMovies();
    expect(component.movies.length).toBe(0);
  })

  it('should call getAllMovies and api call success and push the movie data to the movie array', () => {
    apiService.getAllMovies.and.returnValue(of([{ movieIdentity: { movieName: 'The Dark', theatreName: 'FunBox' }, noOfTickets: 48, bookedSeats: ['A1', 'A2'], statusUpdated: true}]))
    component.getAllMovies();
    expect(component.movies.length).toBe(1);
    expect(component.movies.at(0)?.bookedSeats).toEqual(['A1', 'A2'])
    expect(component.movies.at(0)?.movieIdentity.movieName).toBe('The Dark')
    expect(component.movies.at(0)?.movieIdentity.theatreName).toBe('FunBox')
    expect(component.movies.at(0)?.noOfTickets).toBe(48)
    expect(component.movies.at(0)?.isStatusUpdated).toBe(true);
  })

  it('should call searchKeyWord and call getAllMovies function because searchKeyword is empty', () => {
    apiService.getAllMovies.and.returnValue(throwError({}));
    component.searchBykeyword("");
    expect(apiService.getAllMovies).toHaveBeenCalledTimes(1);
  })

  it('should call searchKeyWord and open toast for warning because movies not found with the search keyword', () => {
    apiService.searchMovie.and.returnValue(throwError({error: { message: "Movie details not found"}}));
    component.searchBykeyword("AB");
    expect(apiService.searchMovie).toHaveBeenCalledTimes(1);
    expect(apiService.searchMovie).toHaveBeenCalledWith("AB");
    expect(toastService.warning).toHaveBeenCalledWith({
      detail: 'Movies not found',
      summary: 'Movie details not found',
      duration: 3000,
    })
  })

  it('should call searchKeyWord and open toast for success and load the movies to the movie array', () => {
    apiService.searchMovie.and.returnValue(of([{ movieIdentity: { movieName: 'The Dark', theatreName: 'FunBox' }, noOfTickets: 48, bookedSeats: ['A1', 'A2'], statusUpdated: true}]));
    component.searchBykeyword("AB");
    expect(apiService.searchMovie).toHaveBeenCalledTimes(1);
    expect(apiService.searchMovie).toHaveBeenCalledWith("AB");
    expect(component.loaded).toBe(false);
    expect(component.movies.length).toBe(1);
    expect(component.movies.at(0)?.bookedSeats).toEqual(['A1', 'A2'])
    expect(component.movies.at(0)?.movieIdentity.movieName).toBe('The Dark')
    expect(component.movies.at(0)?.movieIdentity.theatreName).toBe('FunBox')
    expect(component.movies.at(0)?.noOfTickets).toBe(48)
    expect(component.movies.at(0)?.isStatusUpdated).toBe(true);
  })

  it('should call openAddTickets with success message of added', () => {
    const movie = { movieIdentity: { movieName: 'The Dark', theatreName: 'FunBox' }, noOfTickets: 48, bookedSeats: ['A1', 'A2'], isStatusUpdated: true};
    dialog.open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(of('added'))
    apiService.getAllMovies.and.returnValue(throwError({ }))
    component.openAddTickets(movie);
    expect(apiService.getAllMovies).toHaveBeenCalled();
  })

  it('should call openAddMovie with success message of done', () => {
    dialog.open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(of('done'))
    apiService.getAllMovies.and.returnValue(throwError({ }))
    component.openAddMovie();
    expect(apiService.getAllMovies).toHaveBeenCalled();
  })

  it('should call updateTicketStatus with success message of done', () => {
    const movie = { movieIdentity: { movieName: 'The Dark', theatreName: 'FunBox' }, noOfTickets: 48, bookedSeats: ['A1', 'A2'], isStatusUpdated: true};
    dialog.open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(of('done'))
    apiService.getAllMovies.and.returnValue(throwError({ }))
    component.updateTicketStatus(movie);
    expect(apiService.getAllMovies).toHaveBeenCalled();
  })
});
