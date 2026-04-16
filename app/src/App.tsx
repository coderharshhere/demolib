import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { initializeMockData } from '@/services/dataService';
import { Toaster } from '@/components/ui/sonner';

// Pages
import LandingPage from '@/pages/LandingPage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import StudentManagement from '@/pages/admin/StudentManagement';
import SeatManagement from '@/pages/admin/SeatManagement';
import Payments from '@/pages/admin/Payments';
import Attendance from '@/pages/admin/Attendance';
import AdminSettings from '@/pages/admin/AdminSettings';
import StudentLogin from '@/pages/student/StudentLogin';
import StudentRegister from '@/pages/student/StudentRegister';
import StudentDashboard from '@/pages/student/StudentDashboard';
import MySeat from '@/pages/student/MySeat';
import PaymentPage from '@/pages/student/PaymentPage';
import StudentProfile from '@/pages/student/StudentProfile';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'admin' | 'student' }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  useEffect(() => {
    initializeMockData();
  }, []);
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute allowedRole="admin">
          <StudentManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/seats" element={
        <ProtectedRoute allowedRole="admin">
          <SeatManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/payments" element={
        <ProtectedRoute allowedRole="admin">
          <Payments />
        </ProtectedRoute>
      } />
      <Route path="/admin/attendance" element={
        <ProtectedRoute allowedRole="admin">
          <Attendance />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRole="admin">
          <AdminSettings />
        </ProtectedRoute>
      } />
      
      {/* Student Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/my-seat" element={
        <ProtectedRoute allowedRole="student">
          <MySeat />
        </ProtectedRoute>
      } />
      <Route path="/student/payment" element={
        <ProtectedRoute allowedRole="student">
          <PaymentPage />
        </ProtectedRoute>
      } />
      <Route path="/student/profile" element={
        <ProtectedRoute allowedRole="student">
          <StudentProfile />
        </ProtectedRoute>
      } />
      
      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
