import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/User';
import { Movie } from '../model/Movie';
import { NewTicketsPojo } from '../model/NewTicketsPojo';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  apiEndPoint: string = "http://13.233.216.114:8081/api/v1.0/moviebooking/";
  login(data: any) {
    return this.http.post<any>(this.apiEndPoint + "login", data);
  }
  register(user: User) {
    return this.http.post<any>(this.apiEndPoint + "register", user);
  }
  getAllMovies() {
    return this.http.get<any>(this.apiEndPoint + "all");
  }
  searchMovie(searchKeyword: string) {
    return this.http.get<any>(this.apiEndPoint + "movies/search/" + searchKeyword);
  }
  addMovieTickets(ticketPojo: NewTicketsPojo) {
    const headersOb = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.cookieService.get("jwtToken")
    });

    const httpOptions = {
      headers: headersOb
    };
    return this.http.post<any>(this.apiEndPoint + ticketPojo.movieName + "/add", ticketPojo, httpOptions);
  }
  authenticateAdmin() {
    const headersOb = new HttpHeaders({
      'Authorization': 'Bearer ' + this.cookieService.get("jwtToken")
    });

    const httpOptions = {
      headers: headersOb
    };
    return this.http.get<any>(this.apiEndPoint + "admin", httpOptions);
  }
  authenticateUser() {
    const headersOb = new HttpHeaders({
      'Authorization': 'Bearer ' + this.cookieService.get("jwtToken")
    });

    const httpOptions = {
      headers: headersOb
    };
    return this.http.get<any>(this.apiEndPoint + "user", httpOptions);
  }
  updateTicketStatus(data: Movie) {
    const headersOb = new HttpHeaders({
      'Authorization': 'Bearer ' + this.cookieService.get("jwtToken")
    });

    const httpOptions = {
      headers: headersOb
    };
    const pojo = new NewTicketsPojo(data.movieIdentity.movieName, data.movieIdentity.theatreName, 0, data.bookedSeats);
    return this.http.put<any>(this.apiEndPoint + data.movieIdentity.movieName + "/update", pojo, httpOptions);
  }
  forgotPassword(data: User) {
    return this.http.post<any>(this.apiEndPoint + "forgot/" + data.loginId, data);
  }
  addMovie(data: Movie) {
    const headersOb = new HttpHeaders({
      'Authorization': 'Bearer ' + this.cookieService.get("jwtToken")
    });

    const httpOptions = {
      headers: headersOb
    };
    return this.http.post<any>(this.apiEndPoint + "addMovie", data, httpOptions);
  }
}
