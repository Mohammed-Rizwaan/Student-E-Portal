import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { FolderGit2, Search, Filter, Eye } from 'lucide-react';

export const MentorProjects = () => {
  const { students, projects } = useData();

  // Filter States
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Consolidate all projects with student details
  const allProjects = Object.entries(projects).flatMap(([studentId, list]) => {
    const student = students.find(s => s.rollNumber === studentId);
    return list.map(proj => ({
      ...proj,
      studentId,
      studentName: student ? student.name : 'Unknown Student',
      studentAvatar: student ? student.avatar : ''
    }));
  });

  // Filter Logic
  const filteredProjects = allProjects.filter(proj => {
    const matchesStatus = selectedStatus === 'All' || proj.status === selectedStatus;
    const matchesSearch = 
      proj.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Project Workspace Oversight</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Monitor and track the lifecycle of engineering and research projects undertaken by students.
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by Project Name, student, or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Proposed">Proposed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-500 font-medium">No projects found matching the filter parameters.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredProjects.map(proj => (
            <Card key={proj.id} className="flex flex-col justify-between hover:shadow-md transition-all">
              <CardContent className="p-1 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug">{proj.projectName}</h3>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">Duration: {proj.duration}</p>
                  </div>
                  <Badge variant={
                    proj.status === 'Completed' ? 'success' :
                    proj.status === 'Ongoing' ? 'info' : 'warning'
                  }>
                    {proj.status}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed">{proj.description}</p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.technologies.map(tech => (
                    <span key={tech} className="bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 text-[9px] font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>

              {/* Footer student attribution */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
                <div className="flex items-center gap-2">
                  <img 
                    src={proj.studentAvatar} 
                    alt={proj.studentName} 
                    className="h-6 w-6 rounded-full border border-gray-200 object-cover"
                  />
                  <span className="text-[11px] font-bold text-gray-700">{proj.studentName}</span>
                </div>

                <Link
                  to={`/mentor/students/${proj.studentId}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Eye size={12} />
                  Profile
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
