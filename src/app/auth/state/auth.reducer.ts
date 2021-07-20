import { initialState } from './auth.state';
import { createReducer, on } from '@ngrx/store';
import { autologout, loginSuccess, signupSuccess } from './auth.actions';

const _authReducer = createReducer(initialState,
    on(loginSuccess, (state: any, action: any) => 
    {
        return {
            ...state,
            user: action.user
        };
    }),
    on(signupSuccess, (state: any, action: any) => {
        return {
            ...state,
            user: action.user
        }
    }),
    on(autologout, (state) => {
        return {
            ...state,
            user: null
        }
    })
);

export function AuthReducer(state: any, action: any) {
  return _authReducer(state, action)
}