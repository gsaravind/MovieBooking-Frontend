export class User {
    loginId !: string;
    firstName !: string;
    lastName !: string;
    emailId !: string;
    contactNumber !: string;
    password !: string;
    constructor(loginId: string, firstName: string, lastName: string, emailId: string, contactNumber: string, password: string) {
        this.loginId = loginId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailId = emailId;
        this.contactNumber = contactNumber;
        this.password = password;
    }
}