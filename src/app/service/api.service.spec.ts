import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './api.service';
import { User } from '../model/User';
import { Movie } from '../model/Movie';
import { NewTicketsPojo } from '../model/NewTicketsPojo';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let cookieService: CookieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CookieService, ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to login API', () => {
    const data = { username: 'testuser', password: 'testpassword' };
    service.login(data).subscribe();
    const req = httpMock.expectOne(service.apiEndPoint + 'login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
  });

  it('should send a POST request to Register API', () => {
    const data = {
      loginId: 'manmohan', firstName: 'Manmohan', lastName: 'Saraswat', emailId: 'm@gmail.com',
      password: 'testpassword', contactNumber: '9358342345'
    };
    service.register(data).subscribe();
    const req = httpMock.expectOne(service.apiEndPoint + 'register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
  });

  it('should send a GET request to Get All Movies API', () => {
    service.getAllMovies().subscribe();
    const req = httpMock.expectOne(service.apiEndPoint + 'all');
    expect(req.request.method).toBe('GET');
  });

  it('should send a GET request to Search Movie API', () => {
    const searchKeyword = "ABCD"
    service.searchMovie(searchKeyword).subscribe();
    const req = httpMock.expectOne(service.apiEndPoint + 'movies/search/ABCD');
    expect(req.request.method).toBe('GET');
  });

  it('should send a POST request to Forgot Password API', () => {
    const data = {
      loginId: 'manmohan', firstName: 'Manmohan', lastName: 'Saraswat', emailId: 'm@gmail.com',
      password: 'testpassword', contactNumber: '9358342345'
    };
    service.forgotPassword(data).subscribe();
    const req = httpMock.expectOne(service.apiEndPoint + 'forgot/manmohan');
    expect(req.request.method).toBe('POST');
  });

  it('should send a PUT request to update ticket status API', () => {
    const movie: Movie = {
      movieIdentity: {
        movieName: 'Test Movie',
        theatreName: 'Test Theatre'
      },
      noOfTickets: 0,
      bookedSeats: [],
      isStatusUpdated: false
    };
    const expectedPojo: NewTicketsPojo = new NewTicketsPojo('Test Movie', 'Test Theatre', 0, []);
    spyOn(cookieService, 'get').and.returnValue('jwtToken');
    service.updateTicketStatus(movie).subscribe();

    const req = httpMock.expectOne(service.apiEndPoint + 'Test Movie/update');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(expectedPojo);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwtToken');
  });

  it('should send a POST request to addMovie API', () => {
    const movie: Movie = {
      movieIdentity: {
        movieName: 'Test Movie',
        theatreName: 'Test Theatre'
      },
      noOfTickets: 0,
      bookedSeats: [],
      isStatusUpdated: false
    };
    spyOn(cookieService, 'get').and.returnValue('jwtToken');
    service.addMovie(movie).subscribe();
    const req = httpMock.expectOne(service.apiEndPoint + 'addMovie');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(movie);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwtToken');
  });

  it('should send a POST request to addMovieTickets API', () => {
    const ticketPojo: NewTicketsPojo = {
      movieName: 'Test Movie',
      theatreName: 'Test Theatre',
      totNoOfTickets: 0,
      seatNo: []
    };
    spyOn(cookieService, 'get').and.returnValue('jwtToken');
    service.addMovieTickets(ticketPojo).subscribe();
    const req = httpMock.expectOne(service.apiEndPoint + 'Test Movie/add');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(ticketPojo);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwtToken');
  });

  it('should send a GET request to authenticateAdmin API', () => {
    spyOn(cookieService, 'get').and.returnValue('jwtToken');
    service.authenticateAdmin().subscribe();
    const req = httpMock.expectOne(service.apiEndPoint + 'admin');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwtToken');
  });

  it('should send a GET request to authenticateUser API', () => {
    spyOn(cookieService, 'get').and.returnValue('jwtToken');
    service.authenticateUser().subscribe();
    const req = httpMock.expectOne(service.apiEndPoint + 'user');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwtToken');
  });
});
