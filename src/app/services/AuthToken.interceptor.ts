import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";
import { getToken } from "../auth/state/auth.selector";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
    constructor(private store: Store) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select(getToken).pipe(
            take(1),
            exhaustMap((token: any) => {
                if(!token) {
                    return next.handle(request);
                } else {
                    let modifiedRequest = request.clone({
                        params: request.params.append('auth', token),
                    });
                    return next.handle(modifiedRequest);
                }
            })
        )

    }
}