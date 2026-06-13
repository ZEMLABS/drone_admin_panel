import axiosInstance from './axiosInstance';

export const loginApi = (payload) =>
    axiosInstance.post(
        '/auth/login',
        payload,
    );

export const signupApi = (payload) =>
    axiosInstance.post(
        '/auth/signup',
        payload,
    );

export const verifyOtpApi = (
    payload,
) =>
    axiosInstance.post(
        '/auth/verify-email',
        payload,
    );

export const resendOtpApi = (
    payload,
) =>
    axiosInstance.post(
        '/auth/resend-otp',
        payload,
    );

export const forgotPasswordApi = (
    payload,
) =>
    axiosInstance.post(
        '/auth/forgot-password',
        payload,
    );

export const verifyResetOtpApi =
    (payload) =>
        axiosInstance.post(
            '/auth/verify-reset-otp',
            payload,
        );

export const resetPasswordApi =
    (payload) =>
        axiosInstance.post(
            '/auth/reset-password',
            payload,
        );

export const getMeApi = () =>
    axiosInstance.get(
        '/auth/me',
    );

export const logoutApi = () =>
    axiosInstance.post(
        '/auth/logout',
    );