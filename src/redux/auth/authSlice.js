import { createSlice } from '@reduxjs/toolkit';

import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    setTokens,
} from '../../utils/tokenStorage';

const initialState = {
    user: null,
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    isAuthenticated: !!getAccessToken(),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        loginSuccess: (state, action) => {
            const {
                user,
                accessToken,
                refreshToken,
            } = action.payload;

            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;

            setTokens(accessToken, refreshToken);
        },

        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        logoutSuccess: (state) => {
            clearTokens();

            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setLoading,
    setError,
    loginSuccess,
    setUser,
    logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;