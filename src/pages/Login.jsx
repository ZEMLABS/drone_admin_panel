import React from 'react';

import {
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    TextField,
    Typography,
} from '@mui/material';

import {
    useForm,
} from 'react-hook-form';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    useNavigate,
} from 'react-router-dom';

import {
    loginUser,
} from '../redux/auth/authThunk';

const Login = () => {
    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    const { loading } =
        useSelector(
            (state) =>
                state.auth,
        );

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm();

    const onSubmit = (
        data,
    ) => {
        dispatch(
            loginUser(
                data,
                navigate,
            ),
        );
    };

    return (
        <Container maxWidth="sm">
            <Box
                minHeight="100vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Paper
                    elevation={6}
                    sx={{
                        width: '100%',
                        p: 4,
                        borderRadius: 4,
                        background:
                            '#1e1e1e',
                    }}
                >
                    <Typography
                        variant="h4"
                        textAlign="center"
                        fontWeight={700}
                        mb={1}
                    >
                        Admin Login
                    </Typography>

                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        mb={4}
                    >
                        Zemlabs Drone Admin Portal
                    </Typography>

                    <form
                        onSubmit={handleSubmit(
                            onSubmit,
                        )}
                    >
                        <TextField
                            fullWidth
                            label="Email"
                            margin="normal"
                            {...register(
                                'email',
                                {
                                    required:
                                        'Email is required',
                                },
                            )}
                            error={
                                !!errors.email
                            }
                            helperText={
                                errors.email
                                    ?.message
                            }
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            {...register(
                                'password',
                                {
                                    required:
                                        'Password is required',
                                },
                            )}
                            error={
                                !!errors.password
                            }
                            helperText={
                                errors.password
                                    ?.message
                            }
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                py: 1.3,
                                borderRadius: 2,
                                fontWeight: 700,
                            }}
                        >
                            {loading ? (
                                <CircularProgress
                                    size={24}
                                />
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;