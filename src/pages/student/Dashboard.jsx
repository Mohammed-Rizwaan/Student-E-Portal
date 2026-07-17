import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { 
  Award, 
  FolderGit2, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CreditCard, 
  Percent, 
  GraduationCap,
  Activity,
  FileText,
  ChevronRight
} from 'lucide-react';

export const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    students, 
    academics, 
    projects, 
    certifications, 
    complaints, 
    fees, 
    attendance, 
    assignments, 
    internalMarks 
  } = useData();

  const studentId = currentUser?.id;

  // Retrieve current student records
  const student = students.find(s => s.rollNumber === studentId);
  const studentSems = academics[studentId] || [];
  const studentProjs = projects[studentId] || [];
  const studentCerts = certifications[studentId] || [];
  const studentComps = complaints[studentId] || [];

  // 1. Current CGPA
  const completedSems = (studentSems || []).filter(s => s.cgpa !== null && s.cgpa !== undefined);
  const currentCGPA = completedSems.length > 0 ? completedSems[completedSems.length - 1].cgpa.toFixed(2) : 'N/A';

  // 2. Attendance %
  const attData = attendance[studentId] || { overall: 0 };
  const overallAttendance = `${attData?.overall || 0}%`;

  // 3. Pending Fee
  const studentFeesObj = fees[studentId] || { semesters: [] };
  const pendingFeeAmount = (studentFeesObj?.semesters || [])
    .filter(sem => sem.status === 'Pending')
    .reduce((sum, sem) => sum + sem.amount, 0);
  const pendingFeeStr = `₹${pendingFeeAmount.toLocaleString()}`;

  // 4. Internal Marks Average
  const studentMarks = internalMarks[studentId] || [];
  const subjectsWithMarks = (studentMarks || []).filter(m => m.mid1 !== null || m.mid2 !== null);
  let internalMarksAvg = 'N/A';
  if (subjectsWithMarks.length > 0) {
    const sumEarned = subjectsWithMarks.reduce((acc, m) => acc + (m.mid1 || 0) + (m.mid2 || 0), 0);
    const sumMax = subjectsWithMarks.reduce((acc, m) => acc + (m.maxMarks * 2), 0);
    internalMarksAvg = sumMax > 0 ? `${Math.round((sumEarned / sumMax) * 100)}%` : 'N/A';
  }

  // 5. Pending Assignments
  const studentAssigns = assignments[studentId] || [];
  const pendingAssignmentsCount = (studentAssigns || []).filter(a => a.status === 'Incomplete').length;

  // 6. Complaint Status
  const activeTicketsCount = (studentComps || []).filter(c => c.currentStatus !== 'Resolved' && c.currentStatus !== 'Closed').length;
  const latestComplaintStatus = (studentComps || []).length > 0 ? studentComps[0].currentStatus : 'None';

  // 7. Certifications Earned
  const certsCount = (studentCerts || []).length;

  // 8. Active Projects
  const activeProjectsCount = (studentProjs || []).filter(p => p.status === 'Ongoing').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-lg shadow-blue-500/10">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome back, {student?.name || currentUser?.name}!</h1>
        <p className="text-sm text-blue-100 mt-2 max-w-xl">
          Track your real-time academic scorecard, attendance metrics, pending fees, resources, and timetable from here.
        </p>
      </div>

      {/* KPI Stats Grid (8 summary cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Cumulative CGPA */}
        <Link to="/student/profile?tab=academics">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current CGPA</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{currentCGPA}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 2. Attendance % */}
        <Link to="/student/profile?tab=attendance">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance %</p>
                <h3 className={`text-2xl font-bold mt-1 ${attData.overall >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                  {overallAttendance}
                </h3>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${attData.overall >= 75 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                <Percent size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 3. Pending Fee */}
        <Link to="/student/profile?tab=fees">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Fee</p>
                <h3 className={`text-2xl font-bold mt-1 ${pendingFeeAmount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {pendingFeeStr}
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <CreditCard size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 4. Internal Marks Average */}
        <Link to="/student/profile?tab=internals">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Internal Avg</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{internalMarksAvg}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <GraduationCap size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 5. Pending Assignments */}
        <Link to="/student/assignments">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Assignments</p>
                <h3 className={`text-2xl font-bold mt-1 ${pendingAssignmentsCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {pendingAssignmentsCount}
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Clock size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 6. Complaint Status */}
        <Link to="/student/complaints">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Complaints</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeTicketsCount}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <AlertTriangle size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 7. Certifications Earned */}
        <Link to="/student/profile?tab=progress">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Certifications</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{certsCount}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <Award size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 8. Active Projects */}
        <Link to="/student/profile?tab=progress">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Projects</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeProjectsCount}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <FolderGit2 size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Split Panels */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* GPA Summary Quickview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Academic Progress</h3>
            <Link to="/student/profile?tab=academics" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5">
              Full Scorecard <ChevronRight size={14} />
            </Link>
          </div>
          
          <Card>
            <CardContent className="space-y-4">
              <div className="text-xs space-y-2.5">
                <p className="font-bold text-gray-700">Recent Semester Statuses</p>
                <div className="space-y-2">
                  {studentSems.slice(0, 4).map(sem => (
                    <div key={sem.semester} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span className="font-semibold text-gray-700">Semester {sem.semester}</span>
                      <span className="font-mono text-gray-600">GPA: {sem.sgpa ? sem.sgpa.toFixed(2) : '--'}</span>
                      <Badge variant={sem.status === 'Passed' ? 'success' : sem.status === 'Ongoing' ? 'info' : 'danger'}>
                        {sem.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints and Certifications Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Complaint Log</h3>
          </div>

          <Card>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Latest complaint status: <span className="text-gray-700">{latestComplaintStatus}</span></h4>
              
              {studentComps.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No complaints filed. System is healthy.</p>
              ) : (
                <div className="space-y-2">
                  {studentComps.slice(0, 2).map(comp => (
                    <div key={comp.id} className="bg-gray-50 p-2 rounded text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700 truncate max-w-[200px]">{comp.complaintTitle}</span>
                        <Badge variant={
                          comp.currentStatus === 'Resolved' ? 'success' :
                          comp.currentStatus === 'In Progress' ? 'info' : 'warning'
                        }>
                          {comp.currentStatus}
                        </Badge>
                      </div>
                      {comp.remarks && (
                        <p className="text-[10px] text-blue-700 bg-blue-50/50 p-1 rounded mt-1">
                          <strong>Mentor Remarks:</strong> {comp.remarks}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="text-right mt-2 border-t pt-2">
                    <Link to="/student/complaints" className="text-blue-600 hover:text-blue-800 text-[10px] font-bold inline-flex items-center">
                      File New Complaint / View History <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
