import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';

// Guard Components
import { ProtectedRoute, PublicRoute } from './components/layout/RouteGuards';

// Pages
import { Login } from './pages/Login';
import { Unauthorized } from './pages/Unauthorized';
import { NotFound } from './pages/NotFound';

// Mentor Pages
import { MentorDashboard } from './pages/mentor/Dashboard';
import { MentorStudents } from './pages/mentor/Students';
import { StudentProfile } from './pages/mentor/StudentProfile';
import { AddStudent } from './pages/mentor/AddStudent';
import { EditStudent } from './pages/mentor/EditStudent';
import { MentorProjects } from './pages/mentor/Projects';
import { MentorComplaints } from './pages/mentor/Complaints';
import { MentorProfile } from './pages/mentor/MentorProfile';
import { AcademicResources } from './pages/mentor/AcademicResources';
import { Assignments } from './pages/mentor/Assignments';

// Student Pages
import { StudentDashboard } from './pages/student/Dashboard';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with Guard: Redirects to dashboard if already authenticated */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>

            {/* Error Pages */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Mentor Managed Portal Routes */}
            <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
              <Route path="/mentor" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/mentor/dashboard" replace />} />
                <Route path="dashboard" element={<MentorDashboard />} />
                <Route path="students" element={<MentorStudents />} />
                <Route path="students/:rollNo" element={<StudentProfile isStudentSelf={false} />} />
                <Route path="add-student" element={<AddStudent />} />
                <Route path="edit-student/:rollNo" element={<EditStudent />} />
                <Route path="projects" element={<MentorProjects />} />
                <Route path="complaints" element={<MentorComplaints />} />
                <Route path="resources" element={<AcademicResources isReadOnly={false} />} />
                <Route path="assignments" element={<Assignments isReadOnly={false} />} />
                <Route path="profile" element={<MentorProfile />} />
              </Route>
            </Route>

            {/* Student Portal Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile isStudentSelf={true} />} />
                <Route path="academics" element={<StudentProfile isStudentSelf={true} />} />
                <Route path="projects" element={<StudentProfile isStudentSelf={true} />} />
                <Route path="certifications" element={<StudentProfile isStudentSelf={true} />} />
                <Route path="complaints" element={<StudentProfile isStudentSelf={true} />} />
                <Route path="resources" element={<AcademicResources isReadOnly={true} />} />
                <Route path="assignments" element={<Assignments isReadOnly={true} />} />
              </Route>
            </Route>

            {/* Catch-All 404 Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#1F2937',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500
            }
          }} 
        />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
