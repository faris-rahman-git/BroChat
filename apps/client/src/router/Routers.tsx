import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '../pages/userPages/auth/RegisterPage';
import OtpAndPasswordPage from '../pages/userPages/auth/OtpAndPasswordPage';
import LoginPage from '../pages/userPages/auth/LoginPage';
import ForgotPasswordPage from '../pages/userPages/auth/ForgotPasswordPage';
import ClearErrorOnBackForward from '@client/components/customUi/auth/ClearErrorOnBackForward ';
import HomePage from '@client/pages/userPages/home/HomePage';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import useSocialAuthFromQuery from '@client/hooks/home/useSocialAuthFromQuery';
import Loader from '@client/components/features/loading/Loader';
import { useAxiosAuth } from '@client/hooks/auth/useAxiosAuth';
import DashboardPage from '@client/pages/userPages/home/DashboardPage';

function Routers() {
  useAxiosAuth();
  useSocialAuthFromQuery();

  const { isLoading, role } = useSelector((state: RootState) => state.user);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <ClearErrorOnBackForward />
      <Routes>
        {/* Common Routes */}
        <Route
          path="/register"
          element={
            !role ? (
              <RegisterPage />
            ) : role == 'admin' ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/otpandpassword"
          element={
            !role ? (
              <OtpAndPasswordPage />
            ) : role == 'admin' ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/login"
          element={
            !role ? (
              <LoginPage />
            ) : role == 'admin' ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/forgotPassword"
          element={
            !role ? (
              <ForgotPasswordPage />
            ) : role == 'admin' ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* User Routes */}
        <Route
          path="/"
          element={role == 'user' ? <HomePage /> : <Navigate to="/login" />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={role == 'admin' ? <DashboardPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default Routers;
