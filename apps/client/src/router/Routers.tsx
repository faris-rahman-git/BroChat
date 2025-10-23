import { Routes, Route, Navigate } from 'react-router-dom';
import ClearErrorOnBackForward from '@client/components/customUi/auth/ClearErrorOnBackForward ';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import Loader from '@client/components/features/loading/Loader';
import { useAxiosAuth } from '@client/hooks/auth/api/useAxiosAuth';
import useSocialAuthFromQuery from '@client/hooks/auth/api/useSocialAuthFromQuery';
import RegisterPage from '@client/pages/auth/RegisterPage';
import OtpAndPasswordPage from '@client/pages/auth/OtpAndPasswordPage';
import LoginPage from '@client/pages/auth/LoginPage';
import ForgotPasswordPage from '@client/pages/auth/ForgotPasswordPage';
import HomePage from '@client/pages/user/HomePage';
import VideoPlayerPage from '@client/pages/user/VideoPlayerPage';
import DashboardPage from '@client/pages/admin/DashboardPage';
import { useSocket } from '@client/hooks/socket/useSocket';
import CallPage from '@client/pages/user/CallPage';
import IntroPage from '@client/pages/intro/IntroPage';

function Routers() {
  useAxiosAuth();
  useSocialAuthFromQuery();

  const { loading } = useSocket();

  const { isLoading, role } = useSelector((state: RootState) => state.user);
  if (isLoading || loading) {
    return <Loader />;
  }

  return (
    <>
      <ClearErrorOnBackForward />
      <Routes>
        <Route path="/intro" element={<IntroPage />} />

        {/* auth Routes start */}
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
        {/* auth Routes end */}

        {/* User Routes start*/}
        <Route
          path="/"
          element={role == 'user' ? <HomePage /> : <Navigate to="/intro" />}
        />
        <Route path="/video-player" element={<VideoPlayerPage />} />
        <Route path="/call/:roomID" element={<CallPage />} />
        {/* User Routes end*/}

        {/* Admin Routes start*/}
        <Route
          path="/admin/dashboard"
          element={
            role == 'admin' ? <DashboardPage /> : <Navigate to="/intro" />
          }
        />
        {/* Admin Routes end*/}
      </Routes>
    </>
  );
}

export default Routers;
