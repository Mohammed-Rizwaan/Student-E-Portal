import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { AlertTriangle, Filter, Search, Eye, RefreshCw } from 'lucide-react';

export const MentorComplaints = () => {
  const { students, complaints, updateComplaintStatus } = useData();

  // Filter States
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Get all complaints consolidated with student details
  const allComplaints = Object.entries(complaints).flatMap(([studentId, list]) => {
    const student = students.find(s => s.rollNumber === studentId);
    return list.map(comp => ({
      ...comp,
      studentId,
      studentName: student ? student.name : 'Unknown Student',
      studentAvatar: student ? student.avatar : ''
    }));
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

  // Filter Logic
  const filteredComplaints = allComplaints.filter(comp => {
    const matchesStatus = selectedStatus === 'All' || comp.currentStatus === selectedStatus;
    const matchesCategory = selectedCategory === 'All' || comp.category === selectedCategory;
    const matchesSearch = 
      comp.complaintTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Academic', 'Infrastructure', 'Hostel', 'Administrative', 'Other'];
  const statuses = ['All', 'Pending', 'Acknowledged', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Support & Grievances</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Monitor, investigate, and update status of student complaints and support requests.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by Title, Student Name, or Roll No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints Grid List */}
      {filteredComplaints.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-500 font-medium">No complaints match the current filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map(comp => (
            <Card key={comp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-1 space-y-4">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-50 pb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={comp.studentAvatar} 
                      alt={comp.studentName} 
                      className="h-9 w-9 rounded-full border border-gray-100 object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-snug">{comp.complaintTitle}</h4>
                      <p className="text-xs text-gray-500">
                        Submitted by: <Link to={`/mentor/students/${comp.studentId}`} className="text-blue-600 font-semibold hover:underline">{comp.studentName} ({comp.studentId})</Link>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {comp.category}
                    </span>
                    <Badge variant={
                      comp.currentStatus === 'Resolved' || comp.currentStatus === 'Closed' ? 'success' :
                      comp.currentStatus === 'In Progress' ? 'info' : 'warning'
                    }>
                      {comp.currentStatus}
                    </Badge>
                  </div>
                </div>

                {/* Complaint Text */}
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{comp.description}</p>

                {/* Workflow Status Modifier */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-50 pt-3 text-[10px] text-gray-400 font-semibold">
                  <span>Filed on: {comp.date}</span>

                  <div className="flex items-center gap-2">
                    <RefreshCw size={12} className="text-gray-400" />
                    <span className="text-[10px] text-gray-500 mr-1">Update Status:</span>
                    <select
                      value={comp.currentStatus}
                      onChange={(e) => {
                        updateComplaintStatus(comp.studentId, comp.id, e.target.value);
                        toast.success(`Complaint status changed to ${e.target.value}`);
                      }}
                      className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Acknowledged">Acknowledged</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <Link
                      to={`/mentor/students/${comp.studentId}#complaints`}
                      className="ml-3 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={12} />
                      Full Thread
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
