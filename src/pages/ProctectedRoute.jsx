import React from 'react';

import {
    Navigate,
} from 'react-router-dom';

import {
    useSelector,
} from 'react-redux';

const ProtectedRoute = ({
    children,
}) => {
    const {
        isAuthenticated,
        user,
    } = useSelector(
        (state) =>
            state.auth,
    );

    const token =
        localStorage.getItem(
            'accessToken',
        );

    if (!token || !isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        user &&
        user.role !== 'ADMIN'
    ) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;