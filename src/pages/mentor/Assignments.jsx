import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { 
  FolderGit2, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  User,
  X
} from 'lucide-react';

export const Assignments = ({ isReadOnly = false }) => {
  const { currentUser } = useAuth();
  const { 
    students, 
    assignments, 
    addAssignment, 
    toggleAssignmentStatus, 
    deleteAssignment 
  } = useData();

  // Selected student for Mentor review
  const [selectedStudentId, setSelectedStudentId] = useState(
    students.length > 0 ? students[0].rollNumber : ''
  );

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignForm, setAssignForm] = useState({ name: '', subject: 'Data Structures', dueDate: '' });

  // Student ID resolves to current user if student, or the selector if mentor
  const targetStudentId = isReadOnly ? currentUser?.id : selectedStudentId;
  const currentStudent = students.find(s => s.rollNumber === targetStudentId);
  const studentAssigns = assignments[targetStudentId] || [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!assignForm.name.trim() || !assignForm.dueDate) {
      toast.error("Please fill in Assignment name and Due date");
      return;
    }

    // Add assignment to ALL students in the directory
    students.forEach(s => {
      addAssignment(s.rollNumber, assignForm);
    });

    toast.success("Assignment assigned to all students!");
    setShowAddModal(false);
    setAssignForm({ name: '', subject: 'Data Structures', dueDate: '' });
  };

  const handleToggleStatus = (assignId, currentStatus) => {
    // If student toggles, we can show a simulation toast
    if (currentStatus === 'Incomplete') {
      toast.success("Assignment submitted successfully!");
    } else {
      toast.error("Assignment marked as incomplete.");
    }
    toggleAssignmentStatus(targetStudentId, assignId);
  };

  const handleDelete = (assignId) => {
    // Delete assignment for all students or just selected? Let's delete for all students 
    // that have this same assignment name (to keep it synced), or just this student for safety.
    // Deleting for this student is straightforward and simple.
    deleteAssignment(targetStudentId, assignId);
    toast.success("Assignment removed.");
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Assignments Workspace</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {isReadOnly 
              ? "Track, complete, and submit your subject assignments." 
              : "Create, distribute, and grade assignments across student batches."
            }
          </p>
        </div>
        
        {/* Add Assignment button for Mentor */}
        {!isReadOnly && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Create Assignment
          </button>
        )}
      </div>

      {/* Mentor student selector */}
      {!isReadOnly && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <User size={14} />
            Select Student to Review:
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            {students.map(s => (
              <option key={s.rollNumber} value={s.rollNumber}>{s.name} ({s.rollNumber})</option>
            ))}
          </select>
        </div>
      )}

      {/* Checklist Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900">
          {isReadOnly 
            ? "My Assignment Checklist" 
            : `${currentStudent?.name}'s Assignment Status`
          }
        </h3>

        {studentAssigns.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <p className="text-sm text-gray-500 font-medium">No assignments found for this record.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studentAssigns.map(assign => (
              <Card key={assign.id} className="flex flex-col justify-between hover:shadow-md transition-all">
                <CardContent className="p-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-950 text-sm leading-tight">{assign.name}</h4>
                      <span className="bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 text-[9px] font-semibold inline-block mt-1">
                        {assign.subject}
                      </span>
                    </div>
                    
                    <Badge variant={assign.status === 'Complete' ? 'success' : 'danger'}>
                      {assign.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold pt-2 border-t border-gray-50">
                    <Clock size={11} />
                    <span>Due Date: {assign.dueDate}</span>
                  </div>
                </CardContent>

                {/* Checklist Action panel */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
                  {isReadOnly ? (
                    <button
                      onClick={() => handleToggleStatus(assign.id, assign.status)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                        assign.status === 'Complete' 
                          ? 'text-gray-400 hover:text-red-600' 
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      {assign.status === 'Complete' ? (
                        <>
                          <XCircle size={14} />
                          Undo Submission
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} />
                          Mark Completed
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={() => handleToggleStatus(assign.id, assign.status)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          assign.status === 'Complete' ? 'text-gray-400' : 'text-blue-600'
                        }`}
                      >
                        Force Toggle Completed
                      </button>
                      <button
                        onClick={() => handleDelete(assign.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-50"
                        title="Delete Assignment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Assignment Modal for Mentor */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Create & Assign Assignment</h3>
              <button onClick={() => setShowAddModal(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Subject</label>
                <select
                  value={assignForm.subject}
                  onChange={(e) => setAssignForm({ ...assignForm, subject: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="Data Structures">Data Structures</option>
                  <option value="Compiler Design">Compiler Design</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Database Systems">Database Systems</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={assignForm.name}
                  onChange={(e) => setAssignForm({ ...assignForm, name: e.target.value })}
                  placeholder="e.g. B-Tree Insertion Coding Task"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={assignForm.dueDate}
                  onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create & Distribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
