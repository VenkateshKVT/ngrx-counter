import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken  } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthResponseData } from "../models/AuthResponseData.models";
import { User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    constructor(private _http: HttpClient) {

    }

    login(email: string, password: string): Observable<AuthResponseData>{
        return this._http.post<AuthResponseData>( `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.FIRBASE_API_KEY}`,
        { email, password, returnSecureToken: true });
    }

    formatUser(data: AuthResponseData) {
        const expirationDate = new Date(new Date().getTime() + +data.expiresIn*1000)
        const user = new User(data.email, data.idToken, data.localId, expirationDate);
        return user;
    }

    getErrorMessage(message: string) {
        switch(message) {
            case 'EMAIL_NOT_FOUND':
                return 'Email not found'
            case 'INVALID_PASSWORD':
                return 'Invalid password'
            default:
                return 'Unknown error'
        }
    }
}