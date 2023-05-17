import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmPopupComponent } from './confirm-popup.component';
import { ApiService } from 'src/app/service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Movie } from 'src/app/model/Movie';
import { of, throwError } from 'rxjs';

describe('ConfirmPopupComponent', () => {
  let component: ConfirmPopupComponent;
  let fixture: ComponentFixture<ConfirmPopupComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<NgToastService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmPopupComponent>>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ConfirmPopupComponent>>(['close']);
    const apiServiceSpy = jasmine.createSpyObj<ApiService>(['authenticateAdmin', 'updateTicketStatus']);
    const toastServiceSpy = jasmine.createSpyObj<NgToastService>(['success', 'warning']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ConfirmPopupComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy },
      { provide: ApiService, useValue: apiServiceSpy },
      { provide: NgToastService, useValue: toastServiceSpy },
      { provide: MAT_DIALOG_DATA, useValue: {} }]
    });
    fixture = TestBed.createComponent(ConfirmPopupComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmPopupComponent>>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authenticateAdmin and updateTicketStatus when movie is defined', () => {
    const movie: Movie = new Movie('Dark', 'FunBox', 10, [], true);
    component.movie = movie;

    apiService.authenticateAdmin.and.returnValue(of(null));
    apiService.updateTicketStatus.and.returnValue(of({ message: 'Ticket status updated' }));

    component.updateTicketsStatus();

    expect(apiService.authenticateAdmin).toHaveBeenCalled();
    expect(apiService.updateTicketStatus).toHaveBeenCalledWith(movie);
    expect(toastService.success).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('done');
  });

  it('should not able to update ticket status because user is not authenticated as admin', () => {
    const movie: Movie = new Movie('Dark', 'FunBox', 10, [], true);
    component.movie = movie;

    apiService.authenticateAdmin.and.returnValue(throwError({ res: { error: 'User is not authenticated as admin' } }));
    apiService.updateTicketStatus.and.returnValue(of({ message: 'Ticket status updated' }));

    component.updateTicketsStatus();

    expect(toastService.warning).toHaveBeenCalledWith({
      detail: 'Error',
      summary: 'You are not authorized as Admin',
      duration: 3000
    })

    expect(apiService.authenticateAdmin).toHaveBeenCalled();
    expect(toastService.warning).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('done');
  });

  it('should call ngOnInit and does not throw any error', () => {
    component.ngOnInit();
    expect(component.addTickets).toBeDefined
    expect(component.movie).toBeDefined
  })

  it('should not able to update ticket status because backend throw error while adding movie', () => {
    const movie: Movie = new Movie('Dark', 'FunBox', 10, [], true);
    component.movie = movie;

    apiService.authenticateAdmin.and.returnValue(of(null));
    apiService.updateTicketStatus.and.returnValue(throwError({ res: { error: 'Movie already exists, unable to add movie' } }));

    component.updateTicketsStatus();
    expect(apiService.authenticateAdmin).toHaveBeenCalled();
    expect(apiService.updateTicketStatus).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('done');
  });

});
