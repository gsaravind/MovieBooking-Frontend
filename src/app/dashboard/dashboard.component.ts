import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Movie } from '../model/Movie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    this.movies = [];
    // this.getAllMovies();
  }
  movies!: Movie[];

  searchBykeyword(searchKeyword: string){
    
  }
  getAllMovies(){
    this.apiService.getAllMovies().subscribe({
      next: (res) => {
        this.movies = []
        console.log(res);
        res.forEach((ele: { movieIdentity: { movieName: string; theatreName: string; }; noOfTickets: number; }) => 
          this.movies.push(
            new Movie(ele.movieIdentity.movieName, ele.movieIdentity.theatreName, ele.noOfTickets)
            )
          );
          console.log(this.movies)
      },
      error: (res) => {
        console.log(res)
      }
    })
  }
}
