import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Menu, Bell, ChevronRight, User } from 'lucide-react';

export const Header = ({ onMenuOpen }) => {
  const { currentUser, logout } = useAuth();
  const { students } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to parse path into breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      
      // Try to match student roll number to their name for cleaner breadcrumbs
      let label = path.charAt(0).toUpperCase() + path.slice(1);
      if (path.match(/^\d/)) { // looks like a roll number
        const student = students.find(s => s.rollNumber.toLowerCase() === path.toLowerCase());
        if (student) label = student.name;
      }

      // Format visual representations of path parameters
      if (label === 'Add-student') label = 'Add Student';
      if (label === 'My-profile') label = 'My Profile';

      return {
        label,
        url,
        isLast: index === paths.length - 1
      };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
      {/* Breadcrumbs / Mobile Trigger */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuOpen}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <nav className="hidden items-center gap-1.5 text-sm font-medium text-gray-500 sm:flex">
          <Link to="/" className="hover:text-gray-900 transition-colors">
            System
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.url}>
              <ChevronRight size={14} className="text-gray-400" />
              {crumb.isLast ? (
                <span className="text-gray-950 font-semibold truncate max-w-[200px]">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.url} className="hover:text-gray-900 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right Side Options */}
      <div className="flex items-center gap-4">
        {/* Simple Notification Dot Mock */}
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-950 transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border-2 border-white"></span>
        </button>

        {/* User Info & Badge */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="hidden text-right md:block">
            <p className="text-xs font-semibold text-gray-900">{currentUser?.name}</p>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              currentUser?.role === 'mentor' 
                ? 'bg-blue-50 text-blue-700' 
                : 'bg-green-50 text-green-700'
            }`}>
              {currentUser?.role}
            </span>
          </div>
          
          <Link 
            to={currentUser?.role === 'mentor' ? '/mentor/profile' : '/student/profile'}
            className="group relative flex items-center rounded-full border border-gray-200 p-0.5 hover:ring-2 hover:ring-blue-500/10 transition-all"
          >
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name} 
              className="h-8 w-8 rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};
