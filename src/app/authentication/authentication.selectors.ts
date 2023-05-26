import { createSelector } from '@ngrx/store';
import * as jwt_decode from 'jwt-decode';
import { USER_SCOPES } from '../shared/enums/user-scopes.enum';
import { selectIsNightHour, selectNightTheme, selectTheme } from '../core/settings/settings.selectors';

export const selectAuthenticationState = state => state.authentication;

export const selectorAuthenticatedUser = createSelector(
    selectAuthenticationState,
    state => state.user
);

export const selectorUserAccessToken = createSelector(
    selectorAuthenticatedUser,
    user => user?.access_token
);

export const selectorIsUserLoggedIn = createSelector(
    selectorUserAccessToken,
    access_token => !!access_token
);

export const selectorUserID = createSelector(
    selectorUserAccessToken,
    access_token => {
        if (access_token) {
            return jwt_decode(access_token)?.sub;
        }
    }
);

export const selectorUserFirstAndLastNames = createSelector(
    selectorAuthenticatedUser,
    user => {
        if (user) {
            return user?.first_name + ' ' + user?.last_name;
        }
    }
);

export const selectorUserScopes = createSelector(
    selectorUserAccessToken,
    access_token => {
        if (access_token) {
            return jwt_decode(access_token)?.scopes;
        }
    }
);

export const selectorIsAgent = createSelector(
    selectorUserAccessToken,
    access_token => {
        if (access_token) {
            const landlordTenantPermissions = [USER_SCOPES.LANDLORD, USER_SCOPES.TENANT];
            const scopes = jwt_decode(access_token)?.scopes;
            return !landlordTenantPermissions.some( perm => scopes.includes(perm) );
        }
    }
);

export const selectorIsLandlord = createSelector(
    selectorUserAccessToken,
    access_token => {
        if (access_token) {
            const scopes = jwt_decode(access_token)?.scopes;
            return scopes.includes('am-landlord');
        }
    }
);

export const selectorIsTenant = createSelector(
    selectorUserAccessToken,
    access_token => {
        if (access_token) {
            const scopes = jwt_decode(access_token)?.scopes;
            return scopes.includes('am-tenant');
        }
    }
);

export const selectorUserGeneralSettings = createSelector(
    selectorAuthenticatedUser,
    user => {
        if (user) {
            return user?.g_settings;
        }
    }
);

export const selectorLanguage = createSelector(
    selectorUserGeneralSettings,
    g_settings => {
        if (g_settings) {
            return g_settings?.language;
        }
    }
);

export const selectorTheme = createSelector(
    selectorUserGeneralSettings,
    g_settings => {
        if (g_settings) {
            return g_settings?.theme;
        }
    }
);

export const selectAuthenticationTheme = createSelector(
    selectorTheme,
    selectNightTheme,
    selectIsNightHour,
    (theme, nightTheme, isNightHour) =>
        (isNightHour ? nightTheme : theme)?.toLowerCase()
);

export const selectorDefaultCurrency = createSelector(
    selectorUserGeneralSettings,
    g_settings => {
        if (g_settings) {
            return g_settings?.currency;
        }
    }
);

export const selectorCompanyName = createSelector(
    selectorAuthenticatedUser,
    user => {
        if (user) {
            return user?.g_settings?.company_name;
        }
    }
);
