import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loginStart, loginSuccess } from "./auth.actions";
import { exhaustMap, map } from 'rxjs/operators';
import { AuthService } from "src/app/services/auth.service";
import { Store } from "@ngrx/store";
import { setLoadingSpinner } from "src/app/store/shared/shared.actions";
@Injectable()


export class AuthEffects {
    constructor(private actions$: Actions, private authService: AuthService, private store: Store) {

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
                       this.store.dispatch(setLoadingSpinner({ status: false }));
                       return loginSuccess({user});
                   })
               );
            })
        );
    });
}