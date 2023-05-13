class MovieIdentity{
    movieName!: string
    theatreName!: string;
    constructor(movieName: string, theatreName: string) {
        this.movieName = movieName;
        this.theatreName = theatreName;
    }
}
export class Movie{
    movieIdentity!: MovieIdentity;
    noOfTickets!: number;
    constructor(movieName: string, theatreName: string, noOfTickets: number){
        this.movieIdentity = new MovieIdentity(movieName, theatreName);
        this.noOfTickets = noOfTickets;
    }
}