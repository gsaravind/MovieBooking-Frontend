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
    isStatusUpdated!: boolean;
    constructor(movieName: string, theatreName: string, noOfTickets: number, bookedSeats: string[], isStatusUpdated: boolean) {
        this.movieIdentity = new MovieIdentity(movieName, theatreName);
        this.noOfTickets = noOfTickets;
        this.bookedSeats = bookedSeats;
        this.isStatusUpdated = isStatusUpdated;
    }
}