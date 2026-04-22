import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute     from "./components/PrivateRoute";
import Navbar           from "./components/Navbar";
import LoginPage        from "./pages/LoginPage";
import DashboardPage    from "./pages/DashboardPage";
import TeachersPage     from "./pages/TeachersPage";
import StudentsPage     from "./pages/StudentsPage";
import MyStudentsPage   from "./pages/MyStudentsPage";
import { useAuth }      from "./context/AuthContext";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route path="/" element={
        <PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>
      } />
      <Route path="/teachers" element={
        <PrivateRoute><Layout><TeachersPage /></Layout></PrivateRoute>
      } />
      <Route path="/students" element={
        <PrivateRoute><Layout><StudentsPage /></Layout></PrivateRoute>
      } />
      <Route path="/my-students" element={
        <PrivateRoute><Layout><MyStudentsPage /></Layout></PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}