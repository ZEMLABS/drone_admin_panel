import toast from 'react-hot-toast';

import {
    clearTokens,
} from '../../utils/tokenStorage';

import {
    forgotPasswordApi,
    getMeApi,
    loginApi,
    logoutApi,
    resetPasswordApi,
    signupApi,
    verifyOtpApi,
    verifyResetOtpApi,
} from '../../api/authApi';

import {
    loginSuccess,
    logoutSuccess,
    setError,
    setLoading,
    setUser,
} from './authSlice';

export const loginUser = (
    payload,
    navigate,
) => {
    return async (dispatch) => {
         console.log(
            'LOGIN THUNK RUNNING',
            payload,
        );
        try {
            dispatch(setLoading(true));

            const response =
                await loginApi(payload);

            const {
                token,
                refreshToken,
                user,
            } = response.data;

            if (user?.role !== 'ADMIN') {
                clearTokens();
                toast.error('Admin access only');
                return;
            }

            dispatch(
                loginSuccess({
                    user,
                    accessToken: token,
                    refreshToken,
                }),
            );

            toast.success('Login successful');

            navigate('/');
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                'Login failed';

            dispatch(setError(message));
            toast.error(message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export const getProfile =
    () =>
    async (dispatch) => {
        try {
            const response =
                await getMeApi();

            const user =
                response.data.user ||
                response.data.data;

            if (user?.role !== 'ADMIN') {
                dispatch(logoutSuccess());
                toast.error('Admin access only');
                return;
            }

            dispatch(setUser(user));
        } catch (error) {
            dispatch(logoutSuccess());
        }
    };

export const logoutUser =
    (navigate) =>
    async (dispatch) => {
        try {
            await logoutApi();
        } catch (error) {
            console.log('Logout failed', error);
        } finally {
            dispatch(logoutSuccess());
            toast.success('Logged out');
            navigate('/login');
        }
    };

export const signupUser =
    (payload, navigate) =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));

            await signupApi({
                ...payload,
                purpose: 'SIGNUP',
            });

            toast.success('OTP sent to email');

            navigate('/verify-otp', {
                state: {
                    email: payload.email,
                },
            });
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    'Signup failed',
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

export const verifyOtp =
    (payload, navigate) =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));

            await verifyOtpApi(payload);

            toast.success('Email verified');

            navigate('/login');
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    'OTP verification failed',
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

export const forgotPassword =
    (payload, navigate) =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));

            await forgotPasswordApi(payload);

            toast.success('OTP sent to email');

            navigate('/verify-reset-otp', {
                state: {
                    email: payload.email,
                },
            });
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to send OTP',
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

export const verifyResetOtp =
    (payload, navigate) =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));

            await verifyResetOtpApi(payload);

            toast.success('OTP verified');

            navigate('/reset-password', {
                state: {
                    email: payload.email,
                },
            });
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    'OTP verification failed',
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

export const resetPassword =
    (payload, navigate) =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));

            await resetPasswordApi(payload);

            toast.success('Password reset successful');

            navigate('/login');
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    'Password reset failed',
            );
        } finally {
            dispatch(setLoading(false));
        }
    };
