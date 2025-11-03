import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import InspectionsList from './pages/InspectionsList';
import InspectionDetail from './pages/InspectionDetail';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/restaurants" /> : <Login />}
        />
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute>
              <Restaurants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <RestaurantDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/:id/inspections"
          element={
            <ProtectedRoute>
              <InspectionsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/:id/inspection/:inspectionId"
          element={
            <ProtectedRoute>
              <InspectionDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/restaurants" />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
