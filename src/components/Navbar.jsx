import React from 'react';

import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    useNavigate,
} from 'react-router-dom';

import {
    logoutUser,
} from '../redux/auth/authThunk';

const Navbar = () => {
    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    const {
        isAuthenticated,
    } = useSelector(
        (state) =>
            state.auth,
    );

    const handleLogout = () => {
        dispatch(
            logoutUser(
                navigate,
            ),
        );
    };

    return (
        <AppBar
            position="sticky"
            color="default"
            elevation={1}
            sx={{
                borderBottom:
                    '1px solid rgba(255, 255, 255, 0.08)',
            }}
        >
            <Toolbar>
                <Tooltip title="Home">
                    <IconButton
                        edge="start"
                        color="primary"
                        onClick={() =>
                            navigate('/')
                        }
                        aria-label="home"
                    >
                        <HomeIcon />
                    </IconButton>
                </Tooltip>

                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        ml: 1.5,
                        fontWeight: 700,
                    }}
                >
                    Drone Admin
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {isAuthenticated ? (
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Logout
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        startIcon={<LoginIcon />}
                        onClick={() =>
                            navigate('/login')
                        }
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Sign in
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
