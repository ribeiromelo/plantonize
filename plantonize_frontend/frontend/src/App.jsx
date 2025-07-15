import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CriarEvolucao from './pages/CriarEvolucao';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import VisualizarEvolucao from './pages/VisualizarEvolucao';

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/criar-evolucao"
            element={
              <PrivateRoute>
                <CriarEvolucao />
              </PrivateRoute>
            }
          />
          <Route
  path="/evolucao/:id"
  element={
    <PrivateRoute>
      <VisualizarEvolucao />
    </PrivateRoute>
  }
/>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
