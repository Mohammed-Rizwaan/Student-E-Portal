import React, { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { dummyStudents } from '../data/students';
import { dummyAcademics } from '../data/academics';
import { dummyProjects } from '../data/projects';
import { dummyCertifications } from '../data/certifications';
import { dummyComplaints } from '../data/complaints';
import { dummyFees } from '../data/fees';
import { dummyAttendance } from '../data/attendance';
import { dummyTimetable, dummyNotes } from '../data/resources';
import { dummyAssignments } from '../data/assignments';
import { dummyInternalMarks } from '../data/internalMarks';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [academics, setAcademics] = useState({});
  const [projects, setProjects] = useState({});
  const [certifications, setCertifications] = useState({});
  const [complaints, setComplaints] = useState({});
  
  // New Enhancement States
  const [fees, setFees] = useState({});
  const [attendance, setAttendance] = useState({});
  const [timetable, setTimetable] = useState({});
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [internalMarks, setInternalMarks] = useState({});

  const [loading, setLoading] = useState(true);

  // Initialize data from localStorage or fallback to dummy data
  useEffect(() => {
    const localStudents = localStorage.getItem('mentorconnect_students');
    const localAcademics = localStorage.getItem('mentorconnect_academics');
    const localProjects = localStorage.getItem('mentorconnect_projects');
    const localCertifications = localStorage.getItem('mentorconnect_certifications');
    const localComplaints = localStorage.getItem('mentorconnect_complaints');
    const localFees = localStorage.getItem('mentorconnect_fees');
    const localAttendance = localStorage.getItem('mentorconnect_attendance');
    const localTimetable = localStorage.getItem('mentorconnect_timetable');
    const localNotes = localStorage.getItem('mentorconnect_notes');
    const localAssignments = localStorage.getItem('mentorconnect_assignments');
    const localInternalMarks = localStorage.getItem('mentorconnect_internal_marks');

    let parsedStudents = localStudents ? JSON.parse(localStudents) : dummyStudents;
    let parsedAcademics = localAcademics ? JSON.parse(localAcademics) : dummyAcademics;
    let parsedProjects = localProjects ? JSON.parse(localProjects) : dummyProjects;
    let parsedCertifications = localCertifications ? JSON.parse(localCertifications) : dummyCertifications;
    let parsedComplaints = localComplaints ? JSON.parse(localComplaints) : dummyComplaints;
    let parsedFees = localFees ? JSON.parse(localFees) : dummyFees;
    let parsedAttendance = localAttendance ? JSON.parse(localAttendance) : dummyAttendance;
    let parsedAssignments = localAssignments ? JSON.parse(localAssignments) : dummyAssignments;
    let parsedInternalMarks = localInternalMarks ? JSON.parse(localInternalMarks) : dummyInternalMarks;

    // Self-healing: ensure all students have entries in all sub-databases
    let modified = false;
    parsedStudents.forEach(student => {
      const id = student.rollNumber;
      
      if (!parsedAcademics[id]) {
        parsedAcademics[id] = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"].map(sem => ({
          semester: sem, sgpa: null, cgpa: null, backlogs: 0, status: "Upcoming"
        }));
        modified = true;
      }
      if (!parsedProjects[id]) {
        parsedProjects[id] = [];
        modified = true;
      }
      if (!parsedCertifications[id]) {
        parsedCertifications[id] = [];
        modified = true;
      }
      if (!parsedComplaints[id]) {
        parsedComplaints[id] = [];
        modified = true;
      }
      if (!parsedFees[id] || !parsedFees[id].semesters) {
        parsedFees[id] = {
          tuition: [
            { year: "I Year", paid: 60000, total: 60000, status: "Paid" },
            { year: "II Year", paid: 0, total: 60000, status: "Unpaid" },
            { year: "III Year", paid: 0, total: 60000, status: "Unpaid" },
            { year: "IV Year", paid: 0, total: 60000, status: "Unpaid" }
          ],
          semesters: [
            { id: "sem_fee_1", semester: "1-1", amount: 15000, status: "Paid" },
            { id: "sem_fee_2", semester: "1-2", amount: 15000, status: "Paid" },
            { id: "sem_fee_3", semester: "2-1", amount: 18000, status: "Pending" },
            { id: "sem_fee_4", semester: "2-2", amount: 18000, status: "Pending" },
            { id: "sem_fee_5", semester: "3-1", amount: 20000, status: "Pending" }
          ]
        };
        modified = true;
      }
      if (!parsedAttendance[id] || !parsedAttendance[id].monthly) {
        parsedAttendance[id] = {
          overall: 100, present: 0, absent: 0, total: 0,
          monthly: [
            { month: "Jan", percentage: 100 },
            { month: "Feb", percentage: 100 },
            { month: "Mar", percentage: 100 },
            { month: "Apr", percentage: 100 }
          ]
        };
        modified = true;
      }
      if (!parsedAssignments[id]) {
        parsedAssignments[id] = [];
        modified = true;
      }
      if (!parsedInternalMarks[id]) {
        parsedInternalMarks[id] = [
          { subject: "Data Structures", mid1: null, mid2: null, maxMarks: 30 },
          { subject: "Compiler Design", mid1: null, mid2: null, maxMarks: 30 },
          { subject: "Artificial Intelligence", mid1: null, mid2: null, maxMarks: 30 },
          { subject: "Database Systems", mid1: null, mid2: null, maxMarks: 30 },
          { subject: "Software Engineering", mid1: null, mid2: null, maxMarks: 30 }
        ];
        modified = true;
      }
    });

    if (modified || !localStudents || !localAcademics || !localProjects || !localCertifications || !localComplaints || !localFees || !localAttendance || !localAssignments || !localInternalMarks) {
      localStorage.setItem('mentorconnect_students', JSON.stringify(parsedStudents));
      localStorage.setItem('mentorconnect_academics', JSON.stringify(parsedAcademics));
      localStorage.setItem('mentorconnect_projects', JSON.stringify(parsedProjects));
      localStorage.setItem('mentorconnect_certifications', JSON.stringify(parsedCertifications));
      localStorage.setItem('mentorconnect_complaints', JSON.stringify(parsedComplaints));
      localStorage.setItem('mentorconnect_fees', JSON.stringify(parsedFees));
      localStorage.setItem('mentorconnect_attendance', JSON.stringify(parsedAttendance));
      localStorage.setItem('mentorconnect_assignments', JSON.stringify(parsedAssignments));
      localStorage.setItem('mentorconnect_internal_marks', JSON.stringify(parsedInternalMarks));
    }

    setStudents(parsedStudents);
    setAcademics(parsedAcademics);
    setProjects(parsedProjects);
    setCertifications(parsedCertifications);
    setComplaints(parsedComplaints);
    setFees(parsedFees);
    setAttendance(parsedAttendance);
    setAssignments(parsedAssignments);
    setInternalMarks(parsedInternalMarks);

    // Initialize Notes and Timetable
    if (localNotes) setNotes(JSON.parse(localNotes));
    else {
      setNotes(dummyNotes);
      localStorage.setItem('mentorconnect_notes', JSON.stringify(dummyNotes));
    }

    if (localTimetable) setTimetable(JSON.parse(localTimetable));
    else {
      setTimetable(dummyTimetable);
      localStorage.setItem('mentorconnect_timetable', JSON.stringify(dummyTimetable));
    }

    setLoading(false);
  }, []);

  // Helper to save state changes to localStorage
  const saveToLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Student CRUD
  const addStudent = (studentData) => {
    const newStudentId = studentData.rollNumber;
    
    // Check if student already exists
    if (students.some(s => s.rollNumber.toLowerCase() === newStudentId.toLowerCase())) {
      return { success: false, message: "Student with this Roll Number already exists!" };
    }

    const newStudent = {
      ...studentData,
      id: newStudentId,
      avatar: studentData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name)}&background=3B82F6&color=fff&size=128`,
      mentorId: "bhagya01"
    };

    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    saveToLocal('mentorconnect_students', updatedStudents);

    // Initialize blank academics for the student
    const defaultSemesters = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"].map(sem => ({
      semester: sem,
      sgpa: null,
      cgpa: null,
      backlogs: 0,
      status: "Upcoming"
    }));
    const updatedAcademics = { ...academics, [newStudentId]: defaultSemesters };
    setAcademics(updatedAcademics);
    saveToLocal('mentorconnect_academics', updatedAcademics);

    // Initialize blank lists for projects, certifications, complaints
    setProjects(p => {
      const u = { ...p, [newStudentId]: [] };
      saveToLocal('mentorconnect_projects', u);
      return u;
    });

    setCertifications(c => {
      const u = { ...c, [newStudentId]: [] };
      saveToLocal('mentorconnect_certifications', u);
      return u;
    });

    setComplaints(comp => {
      const u = { ...comp, [newStudentId]: [] };
      saveToLocal('mentorconnect_complaints', u);
      return u;
    });

    // Initialize Fees details
    setFees(f => {
      const u = {
        ...f,
        [newStudentId]: {
          tuition: [
            { year: "I Year", paid: 60000, total: 60000, status: "Paid" },
            { year: "II Year", paid: 0, total: 60000, status: "Unpaid" },
            { year: "III Year", paid: 0, total: 60000, status: "Unpaid" },
            { year: "IV Year", paid: 0, total: 60000, status: "Unpaid" }
          ],
          semesters: [
            { id: "sem_fee_1", semester: "1-1", amount: 15000, status: "Paid" },
            { id: "sem_fee_2", semester: "1-2", amount: 15000, status: "Paid" },
            { id: "sem_fee_3", semester: "2-1", amount: 18000, status: "Pending" },
            { id: "sem_fee_4", semester: "2-2", amount: 18000, status: "Pending" },
            { id: "sem_fee_5", semester: "3-1", amount: 20000, status: "Pending" }
          ]
        }
      };
      saveToLocal('mentorconnect_fees', u);
      return u;
    });

    // Initialize Attendance
    setAttendance(att => {
      const u = {
        ...att,
        [newStudentId]: {
          overall: 100,
          present: 0,
          absent: 0,
          total: 0,
          monthly: [
            { month: "Jan", percentage: 100 },
            { month: "Feb", percentage: 100 },
            { month: "Mar", percentage: 100 },
            { month: "Apr", percentage: 100 }
          ]
        }
      };
      saveToLocal('mentorconnect_attendance', u);
      return u;
    });

    // Initialize Assignments
    setAssignments(as => {
      const u = {
        ...as,
        [newStudentId]: [
          { id: nanoid(), name: "Red-Black Trees Implementation", subject: "Data Structures", dueDate: "2026-07-20", status: "Incomplete" },
          { id: nanoid(), name: "LL(1) Parser Construction", subject: "Compiler Design", dueDate: "2026-07-25", status: "Incomplete" }
        ]
      };
      saveToLocal('mentorconnect_assignments', u);
      return u;
    });

    // Initialize Internal Marks
    setInternalMarks(im => {
      const u = {
        ...im,
        [newStudentId]: [
          { subject: "Data Structures", mid1: null, mid2: null, maxMarks: 30 },
          { subject: "Compiler Design", mid1: null, mid2: null, maxMarks: 30 },
          { subject: "Artificial Intelligence", mid1: null, mid2: null, maxMarks: 30 },
          { subject: "Database Systems", mid1: null, mid2: null, maxMarks: 30 },
          { subject: "Software Engineering", mid1: null, mid2: null, maxMarks: 30 }
        ]
      };
      saveToLocal('mentorconnect_internal_marks', u);
      return u;
    });

    return { success: true, student: newStudent };
  };

  const updateStudent = (rollNumber, studentData) => {
    const updatedStudents = students.map(s => 
      s.rollNumber === rollNumber ? { ...s, ...studentData } : s
    );
    setStudents(updatedStudents);
    saveToLocal('mentorconnect_students', updatedStudents);
    return { success: true };
  };

  const deleteStudent = (rollNumber) => {
    const updatedStudents = students.filter(s => s.rollNumber !== rollNumber);
    setStudents(updatedStudents);
    saveToLocal('mentorconnect_students', updatedStudents);

    // Clean up related data structures
    const newAcademics = { ...academics };
    delete newAcademics[rollNumber];
    setAcademics(newAcademics);
    saveToLocal('mentorconnect_academics', newAcademics);

    const newProjects = { ...projects };
    delete newProjects[rollNumber];
    setProjects(newProjects);
    saveToLocal('mentorconnect_projects', newProjects);

    const newCerts = { ...certifications };
    delete newCerts[rollNumber];
    setCertifications(newCerts);
    saveToLocal('mentorconnect_certifications', newCerts);

    const newComplaints = { ...complaints };
    delete newComplaints[rollNumber];
    setComplaints(newComplaints);
    saveToLocal('mentorconnect_complaints', newComplaints);

    // Clean up new modules data structures
    setFees(f => {
      const u = { ...f };
      delete u[rollNumber];
      saveToLocal('mentorconnect_fees', u);
      return u;
    });

    setAttendance(att => {
      const u = { ...att };
      delete u[rollNumber];
      saveToLocal('mentorconnect_attendance', u);
      return u;
    });

    setAssignments(as => {
      const u = { ...as };
      delete u[rollNumber];
      saveToLocal('mentorconnect_assignments', u);
      return u;
    });

    setInternalMarks(im => {
      const u = { ...im };
      delete u[rollNumber];
      saveToLocal('mentorconnect_internal_marks', u);
      return u;
    });

    return { success: true };
  };

  // Academic Updates
  const updateAcademicSem = (studentId, semester, academicData) => {
    const studentSemesters = academics[studentId] || [];
    const updatedSemesters = studentSemesters.map(sem => 
      sem.semester === semester ? { ...sem, ...academicData } : sem
    );
    const updatedAcademics = { ...academics, [studentId]: updatedSemesters };
    setAcademics(updatedAcademics);
    saveToLocal('mentorconnect_academics', updatedAcademics);
    return { success: true };
  };

  // Project CRUD
  const addProject = (studentId, projectData) => {
    const studentProjs = projects[studentId] || [];
    const newProject = {
      ...projectData,
      id: nanoid()
    };
    const updatedProjs = { ...projects, [studentId]: [newProject, ...studentProjs] };
    setProjects(updatedProjs);
    saveToLocal('mentorconnect_projects', updatedProjs);
    return { success: true, project: newProject };
  };

  const editProject = (studentId, projectId, updatedProjectData) => {
    const studentProjs = projects[studentId] || [];
    const updatedProjsList = studentProjs.map(p => 
      p.id === projectId ? { ...p, ...updatedProjectData } : p
    );
    const updatedProjs = { ...projects, [studentId]: updatedProjsList };
    setProjects(updatedProjs);
    saveToLocal('mentorconnect_projects', updatedProjs);
    return { success: true };
  };

  const deleteProject = (studentId, projectId) => {
    const studentProjs = projects[studentId] || [];
    const updatedProjsList = studentProjs.filter(p => p.id !== projectId);
    const updatedProjs = { ...projects, [studentId]: updatedProjsList };
    setProjects(updatedProjs);
    saveToLocal('mentorconnect_projects', updatedProjs);
    return { success: true };
  };

  // Certification CRUD
  const addCertification = (studentId, certData) => {
    const studentCerts = certifications[studentId] || [];
    const newCert = {
      ...certData,
      id: nanoid()
    };
    const updatedCerts = { ...certifications, [studentId]: [newCert, ...studentCerts] };
    setCertifications(updatedCerts);
    saveToLocal('mentorconnect_certifications', updatedCerts);
    return { success: true, certification: newCert };
  };

  const editCertification = (studentId, certId, updatedCertData) => {
    const studentCerts = certifications[studentId] || [];
    const updatedCertsList = studentCerts.map(c => 
      c.id === certId ? { ...c, ...updatedCertData } : c
    );
    const updatedCerts = { ...certifications, [studentId]: updatedCertsList };
    setCertifications(updatedCerts);
    saveToLocal('mentorconnect_certifications', updatedCerts);
    return { success: true };
  };

  const deleteCertification = (studentId, certId) => {
    const studentCerts = certifications[studentId] || [];
    const updatedCertsList = studentCerts.filter(c => c.id !== certId);
    const updatedCerts = { ...certifications, [studentId]: updatedCertsList };
    setCertifications(updatedCerts);
    saveToLocal('mentorconnect_certifications', updatedCerts);
    return { success: true };
  };

  // Complaint CRUD
  const addComplaint = (studentId, complaintData) => {
    const studentComps = complaints[studentId] || [];
    const newComplaint = {
      ...complaintData,
      id: nanoid(),
      date: new Date().toISOString().split('T')[0],
      currentStatus: complaintData.currentStatus || "Pending",
      remarks: ""
    };
    const updatedComps = { ...complaints, [studentId]: [newComplaint, ...studentComps] };
    setComplaints(updatedComps);
    saveToLocal('mentorconnect_complaints', updatedComps);
    return { success: true, complaint: newComplaint };
  };

  const editComplaint = (studentId, complaintId, updatedComplaintData) => {
    const studentComps = complaints[studentId] || [];
    const updatedCompsList = studentComps.map(c => 
      c.id === complaintId ? { ...c, ...updatedComplaintData } : c
    );
    const updatedComps = { ...complaints, [studentId]: updatedCompsList };
    setComplaints(updatedComps);
    saveToLocal('mentorconnect_complaints', updatedComps);
    return { success: true };
  };

  const updateComplaintStatus = (studentId, complaintId, newStatus) => {
    const studentComps = complaints[studentId] || [];
    const updatedCompsList = studentComps.map(c => 
      c.id === complaintId ? { ...c, currentStatus: newStatus } : c
    );
    const updatedComps = { ...complaints, [studentId]: updatedCompsList };
    setComplaints(updatedComps);
    saveToLocal('mentorconnect_complaints', updatedComps);
    return { success: true };
  };

  const addRemarksToComplaint = (studentId, complaintId, remarks, status) => {
    const studentComps = complaints[studentId] || [];
    const updatedCompsList = studentComps.map(c => 
      c.id === complaintId ? { ...c, remarks: remarks, currentStatus: status } : c
    );
    const updatedComps = { ...complaints, [studentId]: updatedCompsList };
    setComplaints(updatedComps);
    saveToLocal('mentorconnect_complaints', updatedComps);
    return { success: true };
  };

  // Fee Management
  const paySemesterFee = (studentId, feeId) => {
    const studentFeesObj = fees[studentId];
    if (!studentFeesObj) return { success: false, message: "No fees record" };

    let feeAmountPaid = 0;
    const updatedSemesters = studentFeesObj.semesters.map(sem => {
      if (sem.id === feeId && sem.status !== 'Paid') {
        feeAmountPaid = sem.amount;
        return { ...sem, status: 'Paid' };
      }
      return sem;
    });

    if (feeAmountPaid === 0) return { success: true }; // already paid or not found

    // Additionally, update the corresponding Tuition Year details. 
    // Tuition fee total = Year I (60k), Year II (60k), Year III (60k), Year IV (60k)
    // We can distribute the paid semester amount to the active or partially paid tuition year
    const updatedTuition = studentFeesObj.tuition.map(t => {
      if (t.status !== 'Paid') {
        const remaining = t.total - t.paid;
        const toAdd = Math.min(feeAmountPaid, remaining);
        feeAmountPaid -= toAdd;
        const newPaid = t.paid + toAdd;
        let newStatus = t.status;
        if (newPaid === t.total) newStatus = "Paid";
        else if (newPaid > 0) newStatus = `${Math.round((newPaid / t.total) * 100)}% Paid`;
        return { ...t, paid: newPaid, status: newStatus };
      }
      return t;
    });

    const updatedFees = {
      ...fees,
      [studentId]: {
        tuition: updatedTuition,
        semesters: updatedSemesters
      }
    };

    setFees(updatedFees);
    saveToLocal('mentorconnect_fees', updatedFees);
    return { success: true };
  };

  // Attendance Management
  const updateAttendance = (studentId, presentCount, absentCount) => {
    const total = parseInt(presentCount) + parseInt(absentCount);
    const overall = total > 0 ? Math.round((presentCount / total) * 100) : 100;
    
    // Simulate updating monthly logs
    const currentAtt = attendance[studentId] || {};
    const updatedMonthly = (currentAtt.monthly || []).map((m, idx) => {
      // simulate variance in monthly
      if (idx === (currentAtt.monthly?.length - 1)) {
        return { ...m, percentage: overall };
      }
      return m;
    });

    const updatedRecord = {
      overall,
      present: parseInt(presentCount),
      absent: parseInt(absentCount),
      total,
      monthly: updatedMonthly.length > 0 ? updatedMonthly : [
        { month: "Jan", percentage: overall },
        { month: "Feb", percentage: overall },
        { month: "Mar", percentage: overall },
        { month: "Apr", percentage: overall }
      ]
    };

    const updatedAttendance = { ...attendance, [studentId]: updatedRecord };
    setAttendance(updatedAttendance);
    saveToLocal('mentorconnect_attendance', updatedAttendance);
    return { success: true };
  };

  // Lecture Notes
  const uploadNote = (noteData) => {
    const newNote = {
      ...noteData,
      id: nanoid(),
      date: new Date().toISOString().split('T')[0]
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveToLocal('mentorconnect_notes', updatedNotes);
    return { success: true, note: newNote };
  };

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    saveToLocal('mentorconnect_notes', updatedNotes);
    return { success: true };
  };

  // Timetable
  const replaceTimetableSlot = (day, slotIndex, slotData) => {
    const daySlots = timetable[day] || [];
    const updatedSlots = daySlots.map((slot, idx) => 
      idx === slotIndex ? { ...slot, ...slotData } : slot
    );
    const updatedTimetable = { ...timetable, [day]: updatedSlots };
    setTimetable(updatedTimetable);
    saveToLocal('mentorconnect_timetable', updatedTimetable);
    return { success: true };
  };

  // Assignments CRUD
  const addAssignment = (studentId, assignmentData) => {
    const studentAssigns = assignments[studentId] || [];
    const newAssign = {
      id: nanoid(),
      status: "Incomplete",
      ...assignmentData
    };
    const updatedAssigns = { ...assignments, [studentId]: [newAssign, ...studentAssigns] };
    setAssignments(updatedAssigns);
    saveToLocal('mentorconnect_assignments', updatedAssigns);
    return { success: true, assignment: newAssign };
  };

  const toggleAssignmentStatus = (studentId, assignmentId, forceStatus = null) => {
    const studentAssigns = assignments[studentId] || [];
    const updatedList = studentAssigns.map(a => {
      if (a.id === assignmentId) {
        const nextStatus = forceStatus || (a.status === "Complete" ? "Incomplete" : "Complete");
        return { ...a, status: nextStatus };
      }
      return a;
    });
    const updatedAssigns = { ...assignments, [studentId]: updatedList };
    setAssignments(updatedAssigns);
    saveToLocal('mentorconnect_assignments', updatedAssigns);
    return { success: true };
  };

  const deleteAssignment = (studentId, assignmentId) => {
    const studentAssigns = assignments[studentId] || [];
    const updatedList = studentAssigns.filter(a => a.id !== assignmentId);
    const updatedAssigns = { ...assignments, [studentId]: updatedList };
    setAssignments(updatedAssigns);
    saveToLocal('mentorconnect_assignments', updatedAssigns);
    return { success: true };
  };

  // Internal Marks CRUD
  const updateInternalMarks = (studentId, subjectName, examData) => {
    const studentMarks = internalMarks[studentId] || [];
    const exists = studentMarks.some(m => m.subject === subjectName);
    
    let updatedList;
    if (exists) {
      updatedList = studentMarks.map(m => 
        m.subject === subjectName ? { ...m, ...examData } : m
      );
    } else {
      updatedList = [...studentMarks, { subject: subjectName, maxMarks: 30, mid1: null, mid2: null, ...examData }];
    }

    const updatedMarks = { ...internalMarks, [studentId]: updatedList };
    setInternalMarks(updatedMarks);
    saveToLocal('mentorconnect_internal_marks', updatedMarks);
    return { success: true };
  };

  const deleteInternalMarks = (studentId, subjectName) => {
    const studentMarks = internalMarks[studentId] || [];
    const updatedList = studentMarks.filter(m => m.subject !== subjectName);
    const updatedMarks = { ...internalMarks, [studentId]: updatedList };
    setInternalMarks(updatedMarks);
    saveToLocal('mentorconnect_internal_marks', updatedMarks);
    return { success: true };
  };

  return (
    <DataContext.Provider value={{
      students,
      academics,
      projects,
      certifications,
      complaints,
      fees,
      attendance,
      timetable,
      notes,
      assignments,
      internalMarks,
      loading,
      addStudent,
      updateStudent,
      deleteStudent,
      updateAcademicSem,
      addProject,
      editProject,
      deleteProject,
      addCertification,
      editCertification,
      deleteCertification,
      addComplaint,
      editComplaint,
      updateComplaintStatus,
      addRemarksToComplaint,
      paySemesterFee,
      updateAttendance,
      uploadNote,
      deleteNote,
      replaceTimetableSlot,
      addAssignment,
      toggleAssignmentStatus,
      deleteAssignment,
      updateInternalMarks,
      deleteInternalMarks
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
