import {useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import {
    useDispatch,
} from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ManageImages from './pages/ManageImages';

import AddEditProduct from './pages/AddEditProduct';
import Navbar from './components/Navbar';

import Login from './pages/Login';
// import Signup from './pages/auth/Signup';
// import ForgotPassword from './pages/auth/ForgotPassword';
// import VerifyOtp from './pages/auth/VerifyOtp';
// import VerifyResetOtp from './pages/auth/VerifyResetOtp';
// import ResetPassword from './pages/auth/ResetPassword';

import ProtectedRoute from './pages/ProctectedRoute';
import {
    getProfile,
} from './redux/auth/authThunk';

import {
    getAccessToken,
} from './utils/tokenStorage';


const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#e69500',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

export default function App() {
      const dispatch =
        useDispatch();

    useEffect(() => {
        const token =
            getAccessToken();

        if (token) {
            dispatch(
                getProfile(),
            );
        }
    }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        {/* <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/products' element={<ProductList />} />
          <Route path='/products/:id' element={<EditProduct />} />
          <Route path='/add-product' element={<AddProduct />} />
          <Route path='/manage-images' element={<ManageImages />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes> */}
        <Routes>

          {/* AUTH */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* <Route
            path="/signup"
            element={<Signup />}
          /> */}

          {/* <Route
            path="/verify-otp"
            element={<VerifyOtp />}
          /> */}

          {/* <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          /> */}

          {/* <Route
            path="/verify-reset-otp"
            element={<VerifyResetOtp />}
          /> */}

          {/* <Route
            path="/reset-password"
            element={<ResetPassword />}
          /> */}

          {/* PROTECTED */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/edit-product/:id"
            element={
              <ProtectedRoute>
                <AddEditProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/add-product"
            element={
              <ProtectedRoute>
                <AddEditProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-images"
            element={
              <ProtectedRoute>
                <ManageImages />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/replace" />}
          />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}
