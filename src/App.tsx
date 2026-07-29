import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignUp";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import Otp from "./pages/auth/Otp";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./pages/dashboard/Layout/Layout";
import Settings from "./pages/profile/Settings";
import NotificationDetailsPage from "./pages/dashboard/component/notification/NotificationDetailsPage";
import { useNotifications } from "./context/NotificationContext";
import ProfileContent from "./pages/profile/component/ProfileContent";
import OrderDetailPage from "./pages/dashboard/component/OrderDetailpage";
import RequireAuth from "./context/RequireAuth";
import ProtectedRoute from "./components/ProtectedRoute";

function NotificationDetailsRoute() {
  const { notifications, markNotificationAsRead, deleteNotification } =
    useNotifications();

  return (
    <NotificationDetailsPage
      notifications={notifications}
      onMarkAsRead={markNotificationAsRead}
      onDelete={deleteNotification}
    />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp" element={<Otp />} />
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<ProfileContent />} />
        </Route>

        {/* Needs a valid session AND a completed profile */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/notifications/:id"
              element={<NotificationDetailsRoute />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;