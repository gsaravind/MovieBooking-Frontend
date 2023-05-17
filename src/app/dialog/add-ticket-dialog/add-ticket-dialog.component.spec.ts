import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTicketDialogComponent } from './add-ticket-dialog.component';
import { ApiService } from 'src/app/service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Movie } from 'src/app/model/Movie';
import { of, throwError } from 'rxjs';

describe('AddTicketDialogComponent', () => {
  let component: AddTicketDialogComponent;
  let fixture: ComponentFixture<AddTicketDialogComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<NgToastService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddTicketDialogComponent>>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<AddTicketDialogComponent>>(['close']);
    const apiServiceSpy = jasmine.createSpyObj<ApiService>(['addMovieTickets']);
    const toastServiceSpy = jasmine.createSpyObj<NgToastService>(['success', 'warning']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [AddTicketDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy },
      { provide: ApiService, useValue: apiServiceSpy },
      { provide: NgToastService, useValue: toastServiceSpy },
      { provide: MAT_DIALOG_DATA, useValue: { bookedSeats: ['A1'] } }]
    });
    fixture = TestBed.createComponent(AddTicketDialogComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddTicketDialogComponent>>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngAfterViewInit without any exception without having any booked seats', () => {
    component.movie = new Movie('Dark', 'FunBox', 10, [], true);
    component.ngAfterViewInit();
    expect(component.movie.bookedSeats.length).toEqual(0);
  })

  it('should call ngAfterViewInit without any exception with having one booked seats', () => {
    component.movie = new Movie('Dark', 'FunBox', 10, ['A1'], true);
    component.ngAfterViewInit();
    expect(component.movie.bookedSeats.length).toEqual(1)
  })

  it('should call ngOnInit without any error', () => {
    component.ngOnInit();
    expect(component.seats.length).toBe(6);
    expect(component.totSelectedSeats).toBe(0);
  })

  it('should select a seat and update the selected seat count and price', () => {
    const event = {
      target: {
        classList: {
          contains: (className: string) => className === 'seat',
          toggle: (className: string) => { }
        },
        id: 'seat1'
      }
    };

    component.totSelectedSeats = 0;
    component.totSelectedSeatsID = [];
    component.totPrice = 0;

    component.toggleSeat(event);

    expect(component.totSelectedSeats).toBe(1);
    expect(component.totSelectedSeatsID).toEqual(['seat1']);
    expect(component.totPrice).toBe(131);
  });

  it('should deselect a seat and update the selected seat count and price', () => {
    const event = {
      target: {
        classList: {
          contains: (className: string) => className === 'seat' || className === 'selected',
          toggle: (className: string) => { }
        },
        id: 'seat1'
      }
    };
    component.totSelectedSeats = 1;
    component.totSelectedSeatsID = ['seat1'];
    component.totPrice = 131;
    component.toggleSeat(event);
    expect(component.totSelectedSeats).toBe(0);
    expect(component.totSelectedSeatsID).toEqual([]);
    expect(component.totPrice).toBe(0);
  });

  it('should not update anything when clicking on a sold seat', () => {
    const event = {
      target: {
        classList: {
          contains: (className: string) => className === 'seat' || className === 'sold',
          toggle: (className: string) => { }
        },
        id: 'seat1'
      }
    };

    component.totSelectedSeats = 0;
    component.totSelectedSeatsID = [];
    component.totPrice = 0;

    component.toggleSeat(event);

    expect(component.totSelectedSeats).toBe(0);
    expect(component.totSelectedSeatsID).toEqual([]);
    expect(component.totPrice).toBe(0);
  });

  it('should call addMovieTickets and display toast with warning because there is no selected seats', () => {
    component.totSelectedSeats = 0
    component.addMovieTickets();
    expect(toastService.warning).toHaveBeenCalledTimes(1);
    expect(toastService.warning).toHaveBeenCalledWith({
      detail: 'Error',
      summary: 'Please select atleast one seat',
      duration: 3000
    })
  });

  it('should call addMovieTickets and unable to add tickets because the user is not logged in', () => {
    component.totSelectedSeats = 1
    component.movie = new Movie('Dark', 'FunBox', 10, ['A1'], true);
    apiService.addMovieTickets.and.returnValue(throwError({ status: 498, res: { error: 'Unable to add tickets because user is not logged in' } }))
    component.addMovieTickets();
    expect(toastService.warning).toHaveBeenCalledTimes(1);
    expect(toastService.warning).toHaveBeenCalledWith({
      detail: 'Error',
      summary: 'Please login to book tickets',
      duration: 3000
    })
  });

  it('should call addMovieTickets and add tickets successfully and also close the dialog', () => {
    component.totSelectedSeats = 1
    component.movie = new Movie('Dark', 'FunBox', 10, ['A1'], true);
    apiService.addMovieTickets.and.returnValue(of( { message: 'Movie added successfully' } ))
    component.addMovieTickets();
    expect(toastService.success).toHaveBeenCalledTimes(1);
    expect(toastService.success).toHaveBeenCalledWith({
      detail: 'Success',
      summary: 'Movie added successfully',
      duration: 3000
    })
    expect(dialogRef.close).toHaveBeenCalledWith("added")
  });
});
