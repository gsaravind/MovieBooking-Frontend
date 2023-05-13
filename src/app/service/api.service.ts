import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/User';
import { Movie } from '../model/Movie';
import { NewTicketsPojo } from '../model/NewTicketsPojo';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post<any>("http://localhost:8081/api/v1.0/moviebooking/login", data);
  }
  register(user: User) {
    return this.http.post<any>("http://localhost:8081/api/v1.0/moviebooking/register", user);
  }
  getAllMovies() {
    return this.http.get<any>("http://localhost:8081/api/v1.0/moviebooking/all");
  }
  searchMovie(searchKeyword: string) {
    return this.http.get<Movie[]>("http://localhost:8081/api/v1.0/moviebooking/movies/search/" + searchKeyword);
  }
  addMovieTickets(ticketPojo: NewTicketsPojo) {
    return this.http.post<any>("http://localhost:8081/api/v1.0/moviebooking/" + ticketPojo.movieName + "/add", ticketPojo);
  }
}
