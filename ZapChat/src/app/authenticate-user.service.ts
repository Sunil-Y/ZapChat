import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDetails } from './login/loginDetails';
import { UserDetails } from './sign-up/UserDetails';
import { Chat } from './chat-window/chat';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticateUserService {
public loginDetails: LoginDetails;
public userDetails: UserDetails;
public chat: Chat;
  constructor(private http: HttpClient) {

   }
   loginAuthenticate (loginId, password): Observable<LoginDetails> {
    this.loginDetails = new LoginDetails();
    this.loginDetails.phoneNumber = loginId;
    this.loginDetails.password = password;

    return this.http.post<LoginDetails>('http://localhost:3000/user/login/', this.loginDetails)
    .pipe();
   }

   userExist (phoneNumber, password, firstName): Observable<UserDetails> {
    this.userDetails = new UserDetails();
    this.userDetails.phoneNumber = phoneNumber;
    this.userDetails.password = password;
    this.userDetails.firstName = firstName;

    return this.http.post<UserDetails>('http://localhost:3000/user/', this.userDetails)
    .pipe();
   }

   messageSent (message, type): Observable<Chat> {
    this.chat = new Chat();
    this.chat.message = message;
    //this.chat.type = type;
    this.chat.senderNumber = '8578693255';
    this.chat.receiverNumber = '8578692727';

    return this.http.post<Chat>('http://localhost:3000/user/sendMessage', this.chat)
    .pipe();
   }



  }
