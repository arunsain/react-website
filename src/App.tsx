import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import Login from './Login';
import Profile from './Profile';
import Dashboard from './Dashboard';
import Register from "./page/Register";
import ChangePassword from "./page/ChangePassword";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";
import Gallery from "./page/Gallery";
import UploadGallery from "./page/UploadGallery";

function App() {
  const { token } = useSelector((state: RootState) => state.user);
  return (
    <>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />
         <Route
          path="/forgot-password"
          element={!token ? <ForgotPassword /> : <Navigate to="/dashboard" />}
        />

         <Route
          path="/reset-password"
          element={!token ? <ResetPassword /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
         <Route
          path="/upload-gallery"
          element={token ? <UploadGallery /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
         <Route
          path="/change-password"
          element={token ? <ChangePassword /> : <Navigate to="/login" />}
        />

        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/dashboard" />}
        />
        {/* Default route */}
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />

         <Route
          path="/gallery"
          element={<Gallery /> }
        />
      </Routes>
    </>
  )
}

export default App
