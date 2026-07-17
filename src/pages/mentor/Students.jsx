import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { Search, Filter, Trash2, Edit, Eye, UserPlus } from 'lucide-react';

export const MentorStudents = () => {
  const { students, academics, deleteStudent } = useData();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCGPA, setSelectedCGPA] = useState('All');

  // Deletion Dialog State
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Helper to fetch latest CGPA
  const getLatestCGPA = (studentId) => {
    const studentSems = academics[studentId] || [];
    const completedSems = studentSems.filter(s => s.cgpa !== null && s.cgpa !== undefined);
    if (completedSems.length === 0) return 0;
    return completedSems[completedSems.length - 1].cgpa;
  };

  // Extract unique branches and years for dropdown filters
  const branches = ['All', ...new Set(students.map(s => s.branch))];
  const years = ['All', ...new Set(students.map(s => s.joiningYear))];

  // Filter Logic
  const filteredStudents = students.filter(student => {
    const cgpa = getLatestCGPA(student.rollNumber);
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = selectedBranch === 'All' || student.branch === selectedBranch;
    const matchesYear = selectedYear === 'All' || student.joiningYear === selectedYear;

    let matchesCGPA = true;
    if (selectedCGPA === 'high') matchesCGPA = cgpa >= 8.0;
    else if (selectedCGPA === 'avg') matchesCGPA = cgpa >= 6.0 && cgpa < 8.0;
    else if (selectedCGPA === 'risk') matchesCGPA = cgpa < 6.0;

    return matchesSearch && matchesBranch && matchesYear && matchesCGPA;
  });

  const handleDeleteClick = (student, e) => {
    e.preventDefault();
    e.stopPropagation();
    setStudentToDelete(student);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.rollNumber);
      toast.success(`Successfully removed student record for ${studentToDelete.name}`);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Student CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Student Directory</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Browse, filter, and manage academic records of assigned students.</p>
        </div>
        <Link
          to="/mentor/add-student"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/10 hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={16} />
          Add Student
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by Name or Roll Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Branch */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold uppercase">
            <Filter size={14} className="text-gray-400" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option disabled>Branch</option>
              {branches.map(b => (
                <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>
              ))}
            </select>
          </div>

          {/* Joining Year */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            {years.map(y => (
              <option key={y} value={y}>{y === 'All' ? 'All Years' : `Class of ${y}`}</option>
            ))}
          </select>

          {/* CGPA */}
          <select
            value={selectedCGPA}
            onChange={(e) => setSelectedCGPA(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All CGPA Ranges</option>
            <option value="high">Outstanding (CGPA ≥ 8.0)</option>
            <option value="avg">Satisfactory (CGPA 6.0 - 8.0)</option>
            <option value="risk">At Risk (CGPA &lt; 6.0)</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredStudents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-500 font-medium">No student profiles found matching the current search parameters.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map(student => {
            const cgpa = getLatestCGPA(student.rollNumber);
            return (
              <Card key={student.rollNumber} className="flex flex-col justify-between hover:shadow-md transition-shadow relative group">
                <CardContent className="p-0">
                  {/* Student Summary Top */}
                  <div className="flex gap-4 items-start">
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="h-16 w-16 rounded-xl border border-gray-200 object-cover"
                    />
                    <div className="space-y-0.5 overflow-hidden">
                      <h3 className="text-base font-bold text-gray-900 truncate leading-snug">{student.name}</h3>
                      <p className="text-xs text-gray-500 font-semibold">{student.rollNumber}</p>
                      <p className="text-xs text-gray-500 truncate">{student.branch}</p>
                    </div>
                  </div>

                  {/* Student Details Middle */}
                  <div className="grid grid-cols-2 gap-3 mt-6 border-t border-gray-50 pt-4 text-xs">
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Blood Group</p>
                      <p className="font-semibold text-gray-800 mt-0.5">{student.bloodGroup || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Current CGPA</p>
                      <p className={`font-bold mt-0.5 inline-flex items-center gap-1 ${
                        cgpa >= 8.0 ? 'text-green-600' :
                        cgpa >= 6.0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {cgpa > 0 ? cgpa.toFixed(2) : 'N/A'}
                        {cgpa > 0 && cgpa < 6.0 && (
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>

                {/* Directory Controls Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                  {/* View Details */}
                  <Link
                    to={`/mentor/students/${student.rollNumber}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Eye size={14} />
                    View Profile
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/mentor/edit-student/${student.rollNumber}`)}
                      title="Edit Profile"
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(student, e)}
                      title="Delete Record"
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={studentToDelete !== null}
        title="Delete Student Record"
        message={`Are you sure you want to delete the student profile for ${studentToDelete?.name} (${studentToDelete?.rollNumber})? This operation is permanent and will delete all academic, project, certification, and complaint history associated with this student.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setStudentToDelete(null)}
        confirmText="Permanently Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};
