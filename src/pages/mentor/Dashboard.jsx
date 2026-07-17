import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { 
  Users, 
  GraduationCap, 
  AlertTriangle, 
  Activity, 
  ChevronRight,
  TrendingUp,
  Percent,
  CreditCard,
  Clock,
  BookOpen
} from 'lucide-react';

export const MentorDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    students, 
    academics, 
    complaints, 
    attendance, 
    fees, 
    assignments, 
    notes 
  } = useData();

  // 1. Total Students
  const totalStudents = students.length;

  // Helper to fetch latest CGPA
  const getLatestCGPA = (studentId) => {
    const studentSems = academics[studentId] || [];
    const completedSems = (studentSems || []).filter(s => s.cgpa !== null && s.cgpa !== undefined);
    if (completedSems.length === 0) return null;
    return completedSems[completedSems.length - 1].cgpa;
  };

  // Helper to fetch latest backlogs
  const getStudentBacklogs = (studentId) => {
    const studentSems = academics[studentId] || [];
    const completedSems = (studentSems || []).filter(s => s.cgpa !== null);
    if (completedSems.length === 0) return 0;
    return completedSems[completedSems.length - 1].backlogs;
  };

  // 2. Attendance < 75%
  const lowAttendanceCount = students.filter(s => {
    const att = attendance[s.rollNumber] || { overall: 100 };
    return (att?.overall || 100) < 75;
  }).length;

  // 3. Students with Pending Fees
  const studentsWithPendingFeesCount = students.filter(s => {
    const feeObj = fees[s.rollNumber] || { semesters: [] };
    return (feeObj?.semesters || []).some(sem => sem.status === 'Pending');
  }).length;

  // 4. Students with Backlogs
  const studentsWithBacklogsCount = students.filter(s => getStudentBacklogs(s.rollNumber) > 0).length;

  // 5. Average CGPA
  const gpas = students.map(s => getLatestCGPA(s.rollNumber)).filter(g => g !== null);
  const avgCGPA = gpas.length > 0 ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2) : 'N/A';

  // 6. Pending Complaints
  const pendingComplaintsCount = Object.values(complaints).flat()
    .filter(c => c.currentStatus !== 'Resolved' && c.currentStatus !== 'Closed').length;

  // 7. Assignments Pending Review
  const incompleteAssignmentsCount = Object.values(assignments).flat()
    .filter(a => a.status === 'Incomplete').length;

  // 8. Recently Uploaded Notes Count
  const notesCount = notes.length;

  return (
    <div className="space-y-8">
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome, {currentUser?.name}</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Here is the academic performance overview for your assigned student batches.</p>
      </div>

      {/* KPI Cards Grid (8 Cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Total Students */}
        <Link to="/mentor/students">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Students</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Users size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 2. Attendance < 75% */}
        <Card className="hover:shadow-md transition-all h-full">
          <CardContent className="flex items-center justify-between p-1">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance &lt; 75%</p>
              <h3 className={`text-2xl font-bold mt-1 ${lowAttendanceCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {lowAttendanceCount}
              </h3>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${lowAttendanceCount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              <Percent size={20} />
            </div>
          </CardContent>
        </Card>

        {/* 3. Students with Pending Fees */}
        <Card className="hover:shadow-md transition-all h-full">
          <CardContent className="flex items-center justify-between p-1">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Fees</p>
              <h3 className={`text-2xl font-bold mt-1 ${studentsWithPendingFeesCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {studentsWithPendingFeesCount}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <CreditCard size={20} />
            </div>
          </CardContent>
        </Card>

        {/* 4. Students with Backlogs */}
        <Card className="hover:shadow-md transition-all h-full">
          <CardContent className="flex items-center justify-between p-1">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">With Backlogs</p>
              <h3 className={`text-2xl font-bold mt-1 ${studentsWithBacklogsCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {studentsWithBacklogsCount}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>
          </CardContent>
        </Card>

        {/* 5. Average CGPA */}
        <Card className="hover:shadow-md transition-all h-full">
          <CardContent className="flex items-center justify-between p-1">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average CGPA</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{avgCGPA}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <GraduationCap size={20} />
            </div>
          </CardContent>
        </Card>

        {/* 6. Pending Complaints */}
        <Link to="/mentor/complaints">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Complaints</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{pendingComplaintsCount}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <Activity size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 7. Assignments Pending Review */}
        <Link to="/mentor/assignments">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Incomplete Assignments</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{incompleteAssignmentsCount}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Clock size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 8. Recently Uploaded Notes */}
        <Link to="/mentor/resources">
          <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
            <CardContent className="flex items-center justify-between p-1">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lecture Notes</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{notesCount}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <BookOpen size={20} />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main split dashboard layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* At Risk Students Directory Segment */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Students Requiring Academic Support</h3>
            <Link 
              to="/mentor/students" 
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-0.5"
            >
              View Directory <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {students.filter(s => (getLatestCGPA(s.rollNumber) !== null && getLatestCGPA(s.rollNumber) < 6.0) || getStudentBacklogs(s.rollNumber) > 0).length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <p className="text-sm text-gray-500 font-medium">All students are in good academic standing. No critical risks found.</p>
              </div>
            ) : (
              students
                .filter(s => (getLatestCGPA(s.rollNumber) !== null && getLatestCGPA(s.rollNumber) < 6.0) || getStudentBacklogs(s.rollNumber) > 0)
                .map(student => {
                  const latestGpa = getLatestCGPA(student.rollNumber);
                  const backlogs = getStudentBacklogs(student.rollNumber);
                  return (
                    <Card key={student.rollNumber} className="hover:shadow-sm transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={student.avatar} 
                            alt={student.name} 
                            className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">{student.name}</h4>
                            <p className="text-xs text-gray-500">{student.rollNumber} • {student.branch}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          {latestGpa < 6.0 && (
                            <Badge variant="danger">Low CGPA: {latestGpa}</Badge>
                          )}
                          {backlogs > 0 && (
                            <Badge variant="warning">{backlogs} Active Backlog(s)</Badge>
                          )}
                          <Link 
                            to={`/mentor/students/${student.rollNumber}`}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Review Profile
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })
            )}
          </div>
        </div>

        {/* Recently Uploaded Lecture Notes Info Box */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900">Active Notes Shelf</h3>
          <Card>
            <div className="space-y-3">
              {notes.slice(0, 3).map(note => (
                <div key={note.id} className="border-b pb-2 last:border-b-0 last:pb-0 text-xs">
                  <p className="font-bold text-gray-800 truncate" title={note.fileName}>{note.fileName}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{note.subject} • {note.faculty}</p>
                </div>
              ))}
              <div className="pt-2 border-t text-right">
                <Link to="/mentor/resources" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                  Manage Notes & Timetable →
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
