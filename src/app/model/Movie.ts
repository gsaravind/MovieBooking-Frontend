class MovieIdentity {
    movieName!: string
    theatreName!: string;
    constructor(movieName: string, theatreName: string) {
        this.movieName = movieName;
        this.theatreName = theatreName;
    }
}
export class Movie {
    movieIdentity!: MovieIdentity;
    noOfTickets!: number;
    bookedSeats!: string[];
    constructor(movieName: string, theatreName: string, noOfTickets: number, bookedSeats: string[]) {
        this.movieIdentity = new MovieIdentity(movieName, theatreName);
        this.noOfTickets = noOfTickets;
        this.bookedSeats = bookedSeats;
    }
}