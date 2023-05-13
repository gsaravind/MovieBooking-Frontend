export class NewTicketsPojo {
    movieName!: string;
    theatreName!: string;
    totNoOfTickets!: number;
    seatNo!: string[];
    constructor(movieName: string, theatreName: string, totNoOfTickets: number, seatNo: string[]) {
        this.movieName = movieName;
        this.theatreName = theatreName;
        this.totNoOfTickets = totNoOfTickets;
        this.seatNo = seatNo;
    }
}