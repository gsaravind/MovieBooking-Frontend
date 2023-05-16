import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMovieComponent } from './add-movie.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { of, throwError } from 'rxjs';

describe('AddMovieComponent', () => {
  let component: AddMovieComponent;
  let fixture: ComponentFixture<AddMovieComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<NgToastService>;
  let formBuilder: FormBuilder;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddMovieComponent>>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<AddMovieComponent>>(['close']);
    const apiServiceSpy = jasmine.createSpyObj<ApiService>(['authenticateAdmin', 'addMovie']);
    const toastServiceSpy = jasmine.createSpyObj<NgToastService>(['success', 'warning']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatFormFieldModule],
      declarations: [AddMovieComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy },
      { provide: ApiService, useValue: apiServiceSpy },
      { provide: NgToastService, useValue: toastServiceSpy }, FormBuilder]
    });
    fixture = TestBed.createComponent(AddMovieComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;
    formBuilder = TestBed.inject(FormBuilder);
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddMovieComponent>>;
    component.addMovieForm = formBuilder.group({
      movieName: new FormControl('Test Movie', [Validators.required, Validators.minLength(3)]),
      theatreName: new FormControl('Test Theatre', [Validators.required, Validators.minLength(3)])
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit without any exception', () => {
    spyOn(formBuilder, 'group');
    component.ngOnInit();
    expect(formBuilder.group).toHaveBeenCalledTimes(1);
  });

  it('should add movie and close dialog when form is valid and user is authenticated as admin', () => {
    apiService.authenticateAdmin.and.returnValue(of(null));
    apiService.addMovie.and.returnValue(of({ message: 'Movie added successfully' }));

    component.addMovie();

    expect(apiService.authenticateAdmin).toHaveBeenCalled();
    expect(apiService.addMovie).toHaveBeenCalledWith(
      jasmine.objectContaining({
        movieIdentity: jasmine.objectContaining({ movieName: 'Test Movie', theatreName: 'Test Theatre' }),
        noOfTickets: 48, bookedSeats: [], isStatusUpdated: true
      })
    );
    expect(toastService.success).toHaveBeenCalledWith({
      detail: 'Success',
      summary: 'Movie added successfully',
      duration: 3000
    });
    expect(dialogRef.close).toHaveBeenCalledWith('done');
  });

  it('should display warning toast when user is not authenticated as admin', () => {
    apiService.authenticateAdmin.and.returnValue(throwError('Unauthorized'));
    component.addMovie();

    expect(apiService.authenticateAdmin).toHaveBeenCalled();
    expect(toastService.warning).toHaveBeenCalledWith({
      detail: 'Error',
      summary: 'You are not authorized as Admin',
      duration: 3000
    });
    expect(apiService.addMovie).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should display warning toast as unable to add movie due to backend error', () => {
    apiService.authenticateAdmin.and.returnValue(of(null));
    apiService.addMovie.and.returnValue(throwError({ error: 'Unable to add movie' }))
    component.addMovie();

    expect(apiService.authenticateAdmin).toHaveBeenCalled();
    expect(apiService.addMovie).toHaveBeenCalledWith(
      jasmine.objectContaining({
        movieIdentity: jasmine.objectContaining({ movieName: 'Test Movie', theatreName: 'Test Theatre' }),
        noOfTickets: 48, bookedSeats: [], isStatusUpdated: true
      })
    );
    expect(toastService.warning).toHaveBeenCalledTimes(1)
    expect(apiService.addMovie).toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
