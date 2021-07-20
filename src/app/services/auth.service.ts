import { HttpClient } from "@angular/common/http";
import { Injectable  } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { autologout } from "../auth/state/auth.actions";
import { AuthResponseData } from "../models/AuthResponseData.models";
import { User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    timeInterval: any;
    constructor(private _http: HttpClient, private store: Store) {

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
            case 'EMAIL_EXISTS':
                return 'Email already exists'
            default:
                return 'Unknown error'
        }
    }

    signUp(email: string, password: string) {
        return this._http.post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.FIRBASE_API_KEY}`,
            { email, password, returnSecureToken: true }
          );
    }

    setUserDataInLocalStorage(user: User) {
        localStorage.setItem('userData', JSON.stringify(user));
        this.runTimeoutInterval(user);
    }

    runTimeoutInterval(user: User) {
        const currentTime = new Date().getTime(); 
        const expireTime = user.expireDate.getTime();
        this.timeInterval = expireTime - currentTime;
        setTimeout(() => {
            this.store.dispatch(autologout());
        }, this.timeInterval);
    }
    getUserFromLocalStorage() {
        const userDataString = (localStorage.getItem('userData')) ? localStorage.getItem('userData') : null;
        if(userDataString) {
            const userData = JSON.parse(userDataString);
            const expirationDate = new Date(userData.expirationDate);
            const user = new User(userData.email, userData.token, userData.localId, expirationDate);
            this.runTimeoutInterval(user);
            return user;
        }
        return null;
    }

    logout() {
        localStorage.removeItem('userData');
        if(this.timeInterval) {
            clearTimeout(this.timeInterval);
            this.timeInterval = null;
        }
    }
}