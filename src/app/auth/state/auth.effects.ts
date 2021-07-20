import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { autoLogin, autologout, loginStart, loginSuccess, signupStart, signupSuccess } from "./auth.actions";
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from "src/app/services/auth.service";
import { Store } from "@ngrx/store";
import { setErrorMessage, setLoadingSpinner } from "src/app/store/shared/shared.actions";
import { of } from "rxjs";
import { Router } from "@angular/router";
import { User } from "src/app/models/user.model";
@Injectable()


export class AuthEffects {
    constructor(private actions$: Actions, private authService: AuthService, private store: Store, private router: Router) {

    }

    login$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loginStart),
            exhaustMap((action: any) => {
               console.log("Effect for the Action found", action);
               this.store.dispatch(setLoadingSpinner({ status: true }));
               return this.authService.login(action.email, action.password).pipe(
                   map((data) => {
                       const user = this.authService.formatUser(data);
                       this.authService.setUserDataInLocalStorage(user);
                       this.store.dispatch(setLoadingSpinner({ status: false }));
                       this.store.dispatch(setErrorMessage({ message: '' }));
                       return loginSuccess({user: user, redirect: true});
                   }),
                   catchError(errorResponse => {
                       console.log("Error response in auth service effect", errorResponse.error.error.message);
                       const errorMessage = this.authService.getErrorMessage(errorResponse.error.error.message);
                       this.store.dispatch(setLoadingSpinner({ status: false }));
                       return of(setErrorMessage({ message: errorMessage}));
                   })
               );
            })
        );
    });

    loginRedirect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(...[loginSuccess, signupSuccess]),
            tap((action) => {
                (action.redirect) ? this.router.navigate(['/']) : null;
            })
        )
    }, {dispatch: false});

    signUp$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(signupStart),
            exhaustMap((action) => {
                return this.authService.signUp(action.email, action.password).pipe(map((data) => {
                    const user: User = this.authService.formatUser(data);
                    this.store.dispatch(setLoadingSpinner({ status: false }));
                    return signupSuccess({ user: user, redirect: true });
                }))
            }), catchError(err => {
                console.log("Error response in auth service effect signupStart", err.error.error.message);
                const errorMessage = this.authService.getErrorMessage(err.error.error.message);
                this.store.dispatch(setLoadingSpinner({ status: false }));
                return of(setErrorMessage({ message: errorMessage}));
            })
        )
    });

    autoLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(autoLogin),
            mergeMap((action) => {
                const user = this.authService.getUserFromLocalStorage();
                return of(loginSuccess({ user: user, redirect: false }));
            })
        )
    });

    autoLogout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(autologout),
            map(action => {
                this.authService.logout();
                this.router.navigate(['auth'])
            })
        )
    }, {dispatch: false});

}
