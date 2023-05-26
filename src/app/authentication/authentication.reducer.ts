import { User } from './model/user.model';
import { createReducer, on } from '@ngrx/store';
import { AuthenticationActions } from './action-types';

export interface AuthenticationState {
    user: User
}

export const initialAuthenticationState: AuthenticationState = {
    user: undefined
};

export const authenticationReducer = createReducer(
    initialAuthenticationState,
    on(AuthenticationActions.actionLogin, (state, action) => {
        return {
            user: action.user
        }
    }),
    on(AuthenticationActions.actionLogout, state => {
        let language = state?.user?.g_settings?.language;
        let theme = state?.user?.g_settings?.theme;
        if (typeof language === 'undefined' || null) {
            language = 'en';
            theme = 'GREEN-THEME';
        }
        const userData = <User>{
            g_settings : {
                language: language,
                theme: theme,
            }
        };
        return {
            user: userData
        }
    })
);
