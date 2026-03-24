import { Link, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DoctorSearchPage from './pages/DoctorSearchPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="header">
        <h1>MedBook</h1>
        <nav>
          <Link to="/">Doctors</Link>
          {user && <Link to="/dashboard">Dashboard</Link>}
          {user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<DoctorSearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
