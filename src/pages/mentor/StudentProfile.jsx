import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { CGPALineChart } from '../../components/charts/CGPALineChart';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  FolderGit2, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  Plus, 
  ChevronRight, 
  Activity, 
  BookOpen, 
  Percent, 
  CreditCard, 
  GraduationCap, 
  X, 
  Upload, 
  CheckCircle, 
  CheckSquare, 
  Download, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

export const StudentProfile = ({ isStudentSelf = false }) => {
  const { currentUser } = useAuth();
  const { rollNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    students,
    academics,
    projects,
    certifications,
    complaints,
    fees,
    attendance,
    assignments,
    internalMarks,
    updateStudent,
    updateAcademicSem,
    addProject,
    editProject,
    deleteProject,
    addCertification,
    editCertification,
    deleteCertification,
    addComplaint,
    updateComplaintStatus,
    addRemarksToComplaint,
    paySemesterFee,
    updateAttendance,
    toggleAssignmentStatus,
    deleteAssignment,
    addAssignment,
    updateInternalMarks,
    deleteInternalMarks
  } = useData();

  // Resolve Student ID & Role
  const studentId = isStudentSelf ? currentUser?.id : rollNo;
  const isReadOnly = currentUser?.role === 'student';

  const student = students.find(s => s.rollNumber === studentId);
  const studentSems = academics[studentId] || [];
  const studentProjs = projects[studentId] || [];
  const studentCerts = certifications[studentId] || [];
  const studentComps = complaints[studentId] || [];
  const studentFees = fees[studentId] || { tuition: [], semesters: [] };
  const studentAtt = attendance[studentId] || { overall: 0, present: 0, absent: 0, total: 0, monthly: [] };
  const studentAssigns = assignments[studentId] || [];
  const studentMarks = internalMarks[studentId] || [];

  // Parse Initial Tab from Query Param
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) return tab;
    return 'profile';
  };

  // Active Tab State
  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Sync tab if URL search parameter changes
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.search]);

  // Learning Progress Hub sub-tab state: 'projects' | 'certs' | 'assignments'
  const [progressSubTab, setProgressSubTab] = useState('projects');

  // Modals & CRUD States
  const [activeModal, setActiveModal] = useState(null); // 'project'|'cert'|'complaint'|'academic'|'attendance'|'internal'|'student_complaint'|'mentor_complaint'
  const [editItem, setEditItem] = useState(null); // item being edited
  const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'project'|'cert'|'internal', id: string/name }
  const [targetSemester, setTargetSemester] = useState(null);

  // Form states
  const [projectForm, setProjectForm] = useState({ projectName: '', description: '', technologies: '', duration: '', status: 'Proposed' });
  const [certForm, setCertForm] = useState({ certificationName: '', organization: '', date: '', certificateId: '' });
  
  // Revised Complaint Form states
  const [studentComplaintForm, setStudentComplaintForm] = useState({ complaintTitle: '', category: 'Academic', description: '', screenshotName: '' });
  const [mentorComplaintForm, setMentorComplaintForm] = useState({ remarks: '', currentStatus: 'Pending' });

  // Attendance Form
  const [attendanceForm, setAttendanceForm] = useState({ present: 0, absent: 0 });

  // Academic Form
  const [academicForm, setAcademicForm] = useState({ sgpa: '', cgpa: '', backlogs: 0, status: 'Passed' });

  // Internal Marks Form
  const [internalForm, setInternalForm] = useState({ subject: 'Data Structures', mid1: '', mid2: '', maxMarks: 30 });

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-gray-900">Student Profile Not Found</h2>
        <p className="text-sm text-gray-500 mt-1">The requested student record does not exist.</p>
        <button 
          onClick={() => navigate(isReadOnly ? '/student/dashboard' : '/mentor/students')}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // --- CRUD Project Actions ---
  const handleOpenProjectModal = (proj = null) => {
    if (proj) {
      setEditItem(proj);
      setProjectForm({
        projectName: proj.projectName,
        description: proj.description,
        technologies: proj.technologies.join(', '),
        duration: proj.duration,
        status: proj.status
      });
    } else {
      setEditItem(null);
      setProjectForm({ projectName: '', description: '', technologies: '', duration: '', status: 'Proposed' });
    }
    setActiveModal('project');
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    const formattedProj = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (editItem) {
      editProject(studentId, editItem.id, formattedProj);
      toast.success("Project updated successfully");
    } else {
      addProject(studentId, formattedProj);
      toast.success("Project added successfully");
    }
    setActiveModal(null);
  };

  // --- CRUD Certification Actions ---
  const handleOpenCertModal = (cert = null) => {
    if (cert) {
      setEditItem(cert);
      setCertForm({
        certificationName: cert.certificationName,
        organization: cert.organization,
        date: cert.date,
        certificateId: cert.certificateId
      });
    } else {
      setEditItem(null);
      setCertForm({ certificationName: '', organization: '', date: '', certificateId: '' });
    }
    setActiveModal('cert');
  };

  const handleCertSubmit = (e) => {
    e.preventDefault();
    if (editItem) {
      editCertification(studentId, editItem.id, certForm);
      toast.success("Certification updated successfully");
    } else {
      addCertification(studentId, certForm);
      toast.success("Certification added successfully");
    }
    setActiveModal(null);
  };

  // --- CRUD Student Complaint Submission ---
  const handleOpenStudentComplaintModal = () => {
    setStudentComplaintForm({ complaintTitle: '', category: 'Academic', description: '', screenshotName: '' });
    setActiveModal('student_complaint');
  };

  const handleStudentComplaintSubmit = (e) => {
    e.preventDefault();
    if (!studentComplaintForm.complaintTitle.trim() || !studentComplaintForm.description.trim()) {
      toast.error("Please fill out Title and Description");
      return;
    }
    addComplaint(studentId, studentComplaintForm);
    toast.success("Complaint filed successfully!");
    setActiveModal(null);
  };

  // --- CRUD Mentor Complaint Review (Add remarks & status change) ---
  const handleOpenMentorComplaintModal = (comp) => {
    setEditItem(comp);
    setMentorComplaintForm({
      remarks: comp.remarks || '',
      currentStatus: comp.currentStatus
    });
    setActiveModal('mentor_complaint');
  };

  const handleMentorComplaintSubmit = (e) => {
    e.preventDefault();
    addRemarksToComplaint(studentId, editItem.id, mentorComplaintForm.remarks, mentorComplaintForm.currentStatus);
    toast.success("Remarks and status updated successfully!");
    setActiveModal(null);
  };

  // --- Attendance Update ---
  const handleOpenAttendanceModal = () => {
    setAttendanceForm({
      present: studentAtt.present,
      absent: studentAtt.absent
    });
    setActiveModal('attendance');
  };

  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    updateAttendance(studentId, attendanceForm.present, attendanceForm.absent);
    toast.success("Attendance stats updated successfully!");
    setActiveModal(null);
  };

  // --- Semester Grades Update ---
  const handleOpenAcademicModal = (sem) => {
    setTargetSemester(sem);
    setAcademicForm({
      sgpa: sem.sgpa !== null ? sem.sgpa : '',
      cgpa: sem.cgpa !== null ? sem.cgpa : '',
      backlogs: sem.backlogs,
      status: sem.status
    });
    setActiveModal('academic');
  };

  const handleAcademicSubmit = (e) => {
    e.preventDefault();
    const updatedGrades = {
      sgpa: academicForm.sgpa !== '' ? parseFloat(academicForm.sgpa) : null,
      cgpa: academicForm.cgpa !== '' ? parseFloat(academicForm.cgpa) : null,
      backlogs: parseInt(academicForm.backlogs),
      status: academicForm.status
    };
    updateAcademicSem(studentId, targetSemester.semester, updatedGrades);
    toast.success(`Academic records updated for semester ${targetSemester.semester}`);
    setActiveModal(null);
  };

  // --- Internal Marks CRUD ---
  const handleOpenInternalModal = (mark = null) => {
    if (mark) {
      setEditItem(mark);
      setInternalForm({
        subject: mark.subject,
        mid1: mark.mid1 !== null ? mark.mid1 : '',
        mid2: mark.mid2 !== null ? mark.mid2 : '',
        maxMarks: mark.maxMarks
      });
    } else {
      setEditItem(null);
      setInternalForm({ subject: 'Data Structures', mid1: '', mid2: '', maxMarks: 30 });
    }
    setActiveModal('internal');
  };

  const handleInternalSubmit = (e) => {
    e.preventDefault();
    const m1 = internalForm.mid1 !== '' ? parseInt(internalForm.mid1) : null;
    const m2 = internalForm.mid2 !== '' ? parseInt(internalForm.mid2) : null;
    
    if (m1 !== null && (m1 < 0 || m1 > internalForm.maxMarks)) {
      toast.error(`MID-1 Marks must be between 0 and ${internalForm.maxMarks}`);
      return;
    }
    if (m2 !== null && (m2 < 0 || m2 > internalForm.maxMarks)) {
      toast.error(`MID-2 Marks must be between 0 and ${internalForm.maxMarks}`);
      return;
    }

    updateInternalMarks(studentId, internalForm.subject, {
      mid1: m1,
      mid2: m2,
      maxMarks: parseInt(internalForm.maxMarks)
    });

    toast.success(`Internal marks saved for ${internalForm.subject}`);
    setActiveModal(null);
  };

  // --- Delete confirmation callbacks ---
  const handleConfirmDelete = () => {
    if (confirmDelete.type === 'project') {
      deleteProject(studentId, confirmDelete.id);
      toast.success("Project deleted successfully");
    } else if (confirmDelete.type === 'cert') {
      deleteCertification(studentId, confirmDelete.id);
      toast.success("Certification deleted successfully");
    } else if (confirmDelete.type === 'internal') {
      deleteInternalMarks(studentId, confirmDelete.id);
      toast.success("Internal marks record deleted");
    }
    setConfirmDelete(null);
  };

  // --- Payment Simulation ---
  const handlePayFee = (feeId, semesterName) => {
    paySemesterFee(studentId, feeId);
    toast.success(`Payment successful! Semester ${semesterName} fee is now marked as Paid.`);
  };

  // Pie chart data for Attendance
  const pieData = [
    { name: 'Present', value: studentAtt.present, color: '#10B981' },
    { name: 'Absent', value: studentAtt.absent, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img 
            src={student.avatar} 
            alt={student.name} 
            className="h-24 w-24 rounded-2xl border-2 border-gray-100 object-cover shadow-sm"
          />
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-gray-900">{student.name}</h1>
            <p className="text-sm font-semibold text-gray-500">{student.rollNumber}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="primary">{student.branch}</Badge>
              <Badge variant="info">{student.specialization}</Badge>
              <Badge variant="neutral">Class of {student.passingYear}</Badge>
            </div>
          </div>
        </div>

        {/* Dynamic GPA & Attendance Quick metrics */}
        <div className="flex gap-6 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
          <div className="text-center">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Latest CGPA</span>
            <p className="text-lg font-bold text-blue-600 mt-1">
              {studentSems.filter(s => s.cgpa !== null).length > 0
                ? studentSems.filter(s => s.cgpa !== null)[studentSems.filter(s => s.cgpa !== null).length - 1].cgpa.toFixed(2)
                : 'N/A'
              }
            </p>
          </div>
          <div className="h-10 w-px bg-gray-200 self-center"></div>
          <div className="text-center">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Attendance</span>
            <p className={`text-lg font-bold mt-1 ${studentAtt.overall >= 75 ? 'text-green-600' : 'text-red-600'}`}>
              {studentAtt.overall}%
            </p>
          </div>
        </div>
      </div>

      {/* Tabs list (Extended to 6 tabs + Complaints) */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: 'profile', name: 'Profile Info', icon: User },
          { id: 'academics', name: 'Academics', icon: BookOpen },
          { id: 'attendance', name: 'Attendance', icon: Percent },
          { id: 'fees', name: 'Fee details', icon: CreditCard },
          { id: 'progress', name: 'Learning Progress', icon: Award },
          { id: 'internals', name: 'Internal Marks', icon: GraduationCap },
          { id: 'complaints', name: 'Complaints Log', icon: AlertTriangle }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Render Active Tab panels */}
      <div className="min-h-[400px]">
        
        {/* TAB 1: PROFILE INFO */}
        {activeTab === 'profile' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Gender</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{student.gender}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Date of Birth</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{student.dob}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Blood Group</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{student.bloodGroup}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Joining Type</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{student.joiningType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parent details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border-r border-gray-100 pr-4">
                    <p className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-2">Father</p>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Name</p>
                    <p className="font-semibold text-gray-800 mb-2">{student.parentDetails.fatherName}</p>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Phone</p>
                    <p className="font-semibold text-gray-800">{student.parentDetails.fatherPhone}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-2">Mother</p>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Name</p>
                    <p className="font-semibold text-gray-800 mb-2">{student.parentDetails.motherName}</p>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Phone</p>
                    <p className="font-semibold text-gray-800">{student.parentDetails.motherPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Contact details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-3 text-sm">
                <div className="flex gap-3 items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Email</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{student.contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Phone</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{student.contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Address</span>
                    <p className="font-semibold text-gray-800 mt-0.5 leading-relaxed">{student.contactInfo.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: ACADEMICS */}
        {activeTab === 'academics' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CGPA Progression Graph</CardTitle>
              </CardHeader>
              <CardContent>
                <CGPALineChart data={studentSems} />
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {studentSems.map(sem => (
                <Card key={sem.semester} className="hover:shadow-sm relative group">
                  <CardContent className="p-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 text-sm">Semester {sem.semester}</h4>
                      <Badge variant={
                        sem.status === 'Passed' ? 'success' :
                        sem.status === 'Ongoing' ? 'info' :
                        sem.status === 'Upcoming' ? 'neutral' : 'danger'
                      }>
                        {sem.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs border-t pt-2">
                      <div>
                        <span className="text-gray-400 font-semibold uppercase text-[9px]">SGPA</span>
                        <p className="font-bold text-gray-800 mt-0.5">{sem.sgpa !== null ? sem.sgpa.toFixed(2) : '--'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold uppercase text-[9px]">CGPA</span>
                        <p className="font-bold text-gray-800 mt-0.5">{sem.cgpa !== null ? sem.cgpa.toFixed(2) : '--'}</p>
                      </div>
                    </div>
                    {sem.backlogs > 0 && (
                      <div className="rounded bg-red-50 p-1.5 text-[10px] font-semibold text-red-700 flex items-center gap-1">
                        <AlertTriangle size={10} />
                        {sem.backlogs} Backlog(s)
                      </div>
                    )}
                    {!isReadOnly && (
                      <button
                        onClick={() => handleOpenAcademicModal(sem)}
                        className="absolute bottom-3 right-3 rounded bg-gray-50 border p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit grades"
                      >
                        <Edit size={10} className="text-gray-600" />
                      </button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE MANAGEMENT */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="text-center p-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Overall</span>
                  <p className={`text-2xl font-extrabold mt-1 ${studentAtt.overall >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                    {studentAtt.overall}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center p-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Present</span>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">{studentAtt.present}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center p-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Absent</span>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">{studentAtt.absent}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center p-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Total Classes</span>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">{studentAtt.total}</p>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Charts and Mentor Action */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Distribution Pie Chart */}
              <Card className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>Attendance Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
                <div className="flex justify-center gap-6 pb-4 text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span>Present: {studentAtt.present}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span>Absent: {studentAtt.absent}</span>
                  </div>
                </div>
              </Card>

              {/* Monthly Trend Area Chart */}
              <Card className="md:col-span-2 flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Monthly Attendance Trend</CardTitle>
                  {!isReadOnly && (
                    <button
                      onClick={handleOpenAttendanceModal}
                      className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700"
                    >
                      <Edit size={12} />
                      Adjust Attendance
                    </button>
                  )}
                </CardHeader>
                <CardContent className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={studentAtt.monthly || []}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="month" fontSize={11} stroke="#9CA3AF" axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} fontSize={11} stroke="#9CA3AF" axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="percentage" name="Attendance %" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorAtt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 4: FEE MANAGEMENT */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            {/* Tuition Fees Progress Grid */}
            <h3 className="text-base font-bold text-gray-900">Tuition Fees Progression</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(studentFees.tuition || []).map((t, idx) => {
                const pct = Math.round((t.paid / t.total) * 100);
                return (
                  <Card key={idx}>
                    <CardContent className="p-1 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-900 text-sm">{t.year}</h4>
                        <Badge variant={t.status === 'Paid' ? 'success' : t.status === 'Unpaid' ? 'danger' : 'warning'}>
                          {t.status}
                        </Badge>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-500 font-semibold mb-1">
                          <span>Progress</span>
                          <span>{pct}% Paid</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-blue-500' : 'bg-transparent'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 border-t pt-2">
                        <span>Paid: </span>
                        <strong className="text-gray-900 font-mono">₹{t.paid.toLocaleString()}</strong>
                        <span className="mx-1">/</span>
                        <span className="font-mono">₹{t.total.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Semester Fees Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-gray-900">Semester Term Fees</h3>
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full min-w-[500px] divide-y divide-gray-200 text-sm text-left">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Semester</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {(studentFees.semesters || []).map(fee => (
                        <tr key={fee.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-bold text-gray-900">Semester {fee.semester}</td>
                          <td className="px-6 py-4 font-mono text-gray-700">₹{fee.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <Badge variant={fee.status === 'Paid' ? 'success' : 'danger'}>
                              {fee.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {fee.status === 'Pending' ? (
                              isReadOnly ? (
                                <button
                                  onClick={() => handlePayFee(fee.id, fee.semester)}
                                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                                >
                                  Pay Now
                                </button>
                              ) : (
                                <span className="text-xs text-amber-600 font-semibold italic">Awaiting Student Payment</span>
                              )
                            ) : (
                              <span className="text-xs text-green-600 font-bold flex items-center justify-end gap-1">
                                <ShieldCheck size={14} />
                                Settled
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 5: LEARNING PROGRESS HUB */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Learning Hub Header & Sub-Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-gray-900">Learning Progress</h3>
                {/* Sub-selector buttons */}
                <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setProgressSubTab('projects')}
                    className={`rounded-md px-2.5 py-1 transition-all ${
                      progressSubTab === 'projects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Projects ({studentProjs.length})
                  </button>
                  <button
                    onClick={() => setProgressSubTab('certs')}
                    className={`rounded-md px-2.5 py-1 transition-all ${
                      progressSubTab === 'certs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Certifications ({studentCerts.length})
                  </button>
                  <button
                    onClick={() => setProgressSubTab('assignments')}
                    className={`rounded-md px-2.5 py-1 transition-all ${
                      progressSubTab === 'assignments' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Assignments ({studentAssigns.length})
                  </button>
                </div>
              </div>

              {/* Add CTA */}
              {!isReadOnly && progressSubTab !== 'assignments' && (
                <button
                  onClick={() => progressSubTab === 'projects' ? handleOpenProjectModal() : handleOpenCertModal()}
                  className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700"
                >
                  <Plus size={12} />
                  Add {progressSubTab === 'projects' ? 'Project' : 'Certification'}
                </button>
              )}
            </div>

            {/* Sub-Tab Panels */}
            {progressSubTab === 'projects' && (
              <div className="grid gap-4 sm:grid-cols-2">
                {studentProjs.length === 0 ? (
                  <div className="sm:col-span-2 rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                    No academic projects listed.
                  </div>
                ) : (
                  studentProjs.map(proj => (
                    <Card key={proj.id} className="flex flex-col justify-between">
                      <CardContent className="p-1 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-bold text-gray-900 text-sm leading-snug">{proj.projectName}</h4>
                          <Badge variant={
                            proj.status === 'Completed' ? 'success' :
                            proj.status === 'Ongoing' ? 'info' : 'warning'
                          }>
                            {proj.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proj.technologies.map(tech => (
                            <span key={tech} className="bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 text-[9px] font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 mt-4 text-xs">
                        <span className="text-gray-400 font-medium">Duration: {proj.duration}</span>
                        {!isReadOnly && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleOpenProjectModal(proj)} className="rounded p-1 text-gray-500 hover:bg-gray-100">
                              <Edit size={12} />
                            </button>
                            <button onClick={() => setConfirmDelete({ type: 'project', id: proj.id })} className="rounded p-1 text-red-500 hover:bg-red-50">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            )}

            {progressSubTab === 'certs' && (
              <div className="space-y-4">
                {studentCerts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                    No certifications uploaded yet.
                  </div>
                ) : (
                  <div className="relative pl-6 border-l border-gray-200 space-y-4 py-2 ml-4">
                    {studentCerts.map(cert => (
                      <div key={cert.id} className="relative">
                        <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white">
                          <Award size={10} className="text-blue-600" />
                        </span>
                        
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm max-w-xl flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{cert.certificationName}</h4>
                            <p className="text-xs text-gray-500 font-semibold">{cert.organization} • {cert.date}</p>
                            <span className="block mt-2 font-mono text-[9px] text-gray-400 uppercase tracking-wide">ID: {cert.certificateId || 'N/A'}</span>
                          </div>

                          {!isReadOnly && (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleOpenCertModal(cert)} className="rounded p-1 text-gray-400 hover:text-gray-900">
                                <Edit size={12} />
                              </button>
                              <button onClick={() => setConfirmDelete({ type: 'cert', id: cert.id })} className="rounded p-1 text-red-400 hover:text-red-700">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {progressSubTab === 'assignments' && (
              <div className="grid gap-4 sm:grid-cols-2">
                {studentAssigns.length === 0 ? (
                  <div className="sm:col-span-2 rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                    No assignments found.
                  </div>
                ) : (
                  studentAssigns.map(assign => (
                    <Card key={assign.id}>
                      <CardContent className="p-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 text-xs leading-snug">{assign.name}</h4>
                            <span className="bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 text-[9px] font-semibold mt-1 inline-block">
                              {assign.subject}
                            </span>
                          </div>
                          <Badge variant={assign.status === 'Complete' ? 'success' : 'danger'}>
                            {assign.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between border-t pt-2.5 text-[10px] text-gray-400 font-semibold">
                          <span>Due: {assign.dueDate}</span>
                          {isReadOnly && assign.status === 'Incomplete' && (
                            <button
                              onClick={() => {
                                toggleAssignmentStatus(studentId, assign.id);
                                toast.success("Assignment submitted!");
                              }}
                              className="text-blue-600 font-bold hover:underline"
                            >
                              Submit Now
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: INTERNAL MARKS */}
        {activeTab === 'internals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Internal Mid-Term Scorecard</h3>
              {!isReadOnly && (
                <button
                  onClick={() => handleOpenInternalModal()}
                  className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700"
                >
                  <Plus size={12} />
                  Add Subject Marks
                </button>
              )}
            </div>

            {studentMarks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
                No internal marks listed yet.
              </div>
            ) : (
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full min-w-[600px] divide-y divide-gray-200 text-sm text-left">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Subject</th>
                        <th className="px-6 py-3">MID-1 (30)</th>
                        <th className="px-6 py-3">MID-2 (30)</th>
                        <th className="px-6 py-3">Total Internal (60)</th>
                        <th className="px-6 py-3">Percentage</th>
                        <th className="px-6 py-3">Indicator</th>
                        {!isReadOnly && <th className="px-6 py-3 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {studentMarks.map((mark, idx) => {
                        const m1 = mark.mid1 !== null ? mark.mid1 : 0;
                        const m2 = mark.mid2 !== null ? mark.mid2 : 0;
                        const total = m1 + m2;
                        const pct = Math.round((total / 60) * 100);

                        let indicator = 'Needs Attention';
                        let variant = 'danger';
                        if (pct >= 90) { indicator = 'Excellent'; variant = 'success'; }
                        else if (pct >= 70) { indicator = 'Good'; variant = 'primary'; }
                        else if (pct >= 50) { indicator = 'Satisfactory'; variant = 'warning'; }

                        const hasMarks = mark.mid1 !== null || mark.mid2 !== null;

                        return (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-bold text-gray-900">{mark.subject}</td>
                            <td className="px-6 py-4 font-mono">{mark.mid1 !== null ? `${mark.mid1}/30` : '--'}</td>
                            <td className="px-6 py-4 font-mono">{mark.mid2 !== null ? `${mark.mid2}/30` : '--'}</td>
                            <td className="px-6 py-4 font-bold font-mono">{hasMarks ? `${total}/60` : '--'}</td>
                            <td className="px-6 py-4 font-mono">{hasMarks ? `${pct}%` : '--'}</td>
                            <td className="px-6 py-4">
                              {hasMarks ? (
                                <Badge variant={variant}>{indicator}</Badge>
                              ) : (
                                <span className="text-gray-400 italic text-xs">Ungraded</span>
                              )}
                            </td>
                            {!isReadOnly && (
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenInternalModal(mark)}
                                    className="rounded p-1 text-gray-400 hover:text-gray-900"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete({ type: 'internal', id: mark.subject })}
                                    className="rounded p-1 text-red-400 hover:text-red-700"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* TAB 7: COMPLAINTS LOG */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Complaints Thread</h3>
              {isReadOnly && (
                <button
                  onClick={handleOpenStudentComplaintModal}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Plus size={14} />
                  Submit Complaint
                </button>
              )}
            </div>

            {studentComps.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
                No complaints history listed.
              </div>
            ) : (
              <div className="space-y-4">
                {studentComps.map(comp => (
                  <Card key={comp.id}>
                    <CardContent className="p-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm leading-snug">{comp.complaintTitle}</h4>
                          <span className="bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 text-[9px] font-semibold">
                            {comp.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2.5">
                          <Badge variant={
                            comp.currentStatus === 'Resolved' || comp.currentStatus === 'Closed' ? 'success' :
                            comp.currentStatus === 'In Progress' ? 'info' : 'warning'
                          }>
                            {comp.currentStatus}
                          </Badge>

                          {!isReadOnly && (
                            <button
                              onClick={() => handleOpenMentorComplaintModal(comp)}
                              className="rounded p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                            >
                              <Edit size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">{comp.description}</p>
                      
                      {comp.screenshotName && (
                        <div className="rounded bg-gray-50 p-2 text-xs flex items-center gap-2 max-w-sm border">
                          <FileText size={14} className="text-gray-400" />
                          <span className="text-gray-600 truncate flex-1">{comp.screenshotName}</span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase shrink-0">Screenshot</span>
                        </div>
                      )}

                      {comp.remarks && (
                        <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 mt-3">
                          <p className="text-xs font-bold text-blue-900">Mentor Remarks</p>
                          <p className="text-xs text-blue-800 mt-1 leading-relaxed">{comp.remarks}</p>
                        </div>
                      )}

                      <p className="text-[10px] text-gray-400 font-semibold border-t pt-2.5">
                        Filed on: {comp.date}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- ALL INLINE MODAL OVERLAYS --- */}

      {/* 1. Project modal */}
      {activeModal === 'project' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">{editItem ? 'Edit Project Details' : 'Add New Project'}</h3>
              <button onClick={() => setActiveModal(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Project Name</label>
                <input
                  type="text" required
                  value={projectForm.projectName}
                  onChange={(e) => setProjectForm({ ...projectForm, projectName: e.target.value })}
                  placeholder="e.g. Microservices Gateway"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  required rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Brief project details..."
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Duration</label>
                  <input
                    type="text" required
                    value={projectForm.duration}
                    onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
                    placeholder="e.g. 3 Months"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Proposed">Proposed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Technologies (comma separated)</label>
                <input
                  type="text" required
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  placeholder="Python, Flask, Docker"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <button type="button" onClick={() => setActiveModal(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Certification modal */}
      {activeModal === 'cert' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">{editItem ? 'Edit Certification' : 'Add Certification'}</h3>
              <button onClick={() => setActiveModal(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <form onSubmit={handleCertSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Certification Name</label>
                <input
                  type="text" required
                  value={certForm.certificationName}
                  onChange={(e) => setCertForm({ ...certForm, certificationName: e.target.value })}
                  placeholder="e.g. AWS Developer Associate"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Issuing Organization</label>
                <input
                  type="text" required
                  value={certForm.organization}
                  onChange={(e) => setCertForm({ ...certForm, organization: e.target.value })}
                  placeholder="e.g. Amazon Web Services"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Issue Date</label>
                  <input
                    type="date" required
                    value={certForm.date}
                    onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Credential ID (Optional)</label>
                  <input
                    type="text"
                    value={certForm.certificateId}
                    onChange={(e) => setCertForm({ ...certForm, certificateId: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <button type="button" onClick={() => setActiveModal(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Student Submit Complaint Modal */}
      {activeModal === 'student_complaint' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">File Support Request / Complaint</h3>
              <button onClick={() => setActiveModal(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <form onSubmit={handleStudentComplaintSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Complaint Title</label>
                <input
                  type="text" required
                  value={studentComplaintForm.complaintTitle}
                  onChange={(e) => setStudentComplaintForm({ ...studentComplaintForm, complaintTitle: e.target.value })}
                  placeholder="Brief summary of the issue..."
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={studentComplaintForm.category}
                    onChange={(e) => setStudentComplaintForm({ ...studentComplaintForm, category: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Attach Screenshot (Simulated)</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const name = e.target.files[0]?.name || '';
                      setStudentComplaintForm({ ...studentComplaintForm, screenshotName: name });
                    }}
                    className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  required rows={4}
                  value={studentComplaintForm.description}
                  onChange={(e) => setStudentComplaintForm({ ...studentComplaintForm, description: e.target.value })}
                  placeholder="Provide comprehensive details of the issue..."
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <button type="button" onClick={() => setActiveModal(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Mentor Review Complaint Modal */}
      {activeModal === 'mentor_complaint' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Review Support Request</h3>
              <button onClick={() => setActiveModal(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <form onSubmit={handleMentorComplaintSubmit} className="space-y-4">
              {/* ReadOnly info */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Complaint Title</label>
                <p className="font-bold text-gray-800 text-sm">{editItem?.complaintTitle}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Original Description</label>
                <p className="text-xs text-gray-600 bg-gray-50 border p-2 rounded leading-relaxed">{editItem?.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Update Status</label>
                  <select
                    value={mentorComplaintForm.currentStatus}
                    onChange={(e) => setMentorComplaintForm({ ...mentorComplaintForm, currentStatus: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Mentor Remarks</label>
                <textarea
                  rows={3}
                  value={mentorComplaintForm.remarks}
                  onChange={(e) => setMentorComplaintForm({ ...mentorComplaintForm, remarks: e.target.value })}
                  placeholder="Provide resolution remarks..."
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <button type="button" onClick={() => setActiveModal(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save Resolution</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Mentor Edit Attendance Modal */}
      {activeModal === 'attendance' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Adjust Attendance Records</h3>
              <button onClick={() => setActiveModal(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <form onSubmit={handleAttendanceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Classes Present</label>
                  <input
                    type="number" required min="0"
                    value={attendanceForm.present}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, present: parseInt(e.target.value) || 0 })}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Classes Absent</label>
                  <input
                    type="number" required min="0"
                    value={attendanceForm.absent}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, absent: parseInt(e.target.value) || 0 })}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <button type="button" onClick={() => setActiveModal(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Academic Grades Modal */}
      {activeModal === 'academic' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Update Grades: Sem {targetSemester?.semester}</h3>
              <button onClick={() => setActiveModal(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <form onSubmit={handleAcademicSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">SGPA</label>
                  <input
                    type="number" step="0.01" min="0" max="10"
                    value={academicForm.sgpa}
                    onChange={(e) => setAcademicForm({ ...academicForm, sgpa: e.target.value })}
                    placeholder="e.g. 8.5"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">CGPA</label>
                  <input
                    type="number" step="0.01" min="0" max="10"
                    value={academicForm.cgpa}
                    onChange={(e) => setAcademicForm({ ...academicForm, cgpa: e.target.value })}
                    placeholder="e.g. 8.4"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Backlogs</label>
                  <input
                    type="number" min="0"
                    value={academicForm.backlogs}
                    onChange={(e) => setAcademicForm({ ...academicForm, backlogs: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Academic Status</label>
                  <select
                    value={academicForm.status}
                    onChange={(e) => setAcademicForm({ ...academicForm, status: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Passed">Passed</option>
                    <option value="Passed (1 Backlog)">Passed (1 Backlog)</option>
                    <option value="Passed (2 Backlogs)">Passed (2 Backlogs)</option>
                    <option value="Academic Probation">Academic Probation</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <button type="button" onClick={() => setActiveModal(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save Grades</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Mentor Edit/Add Internal Marks Modal */}
      {activeModal === 'internal' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">{editItem ? 'Edit Subject Marks' : 'Add Subject Marks'}</h3>
              <button onClick={() => setActiveModal(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <form onSubmit={handleInternalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Subject</label>
                <input
                  type="text" required
                  value={internalForm.subject}
                  disabled={editItem !== null}
                  onChange={(e) => setInternalForm({ ...internalForm, subject: e.target.value })}
                  placeholder="e.g. Compiler Design"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">MID-1 Marks ({internalForm.maxMarks})</label>
                  <input
                    type="number" min="0" max={internalForm.maxMarks}
                    value={internalForm.mid1}
                    onChange={(e) => setInternalForm({ ...internalForm, mid1: e.target.value })}
                    placeholder="e.g. 26"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">MID-2 Marks ({internalForm.maxMarks})</label>
                  <input
                    type="number" min="0" max={internalForm.maxMarks}
                    value={internalForm.mid2}
                    onChange={(e) => setInternalForm({ ...internalForm, mid2: e.target.value })}
                    placeholder="e.g. 28"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <button type="button" onClick={() => setActiveModal(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save Marks</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${confirmDelete?.type}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};
