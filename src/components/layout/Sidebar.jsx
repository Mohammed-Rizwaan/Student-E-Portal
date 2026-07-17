import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FolderGit2, 
  Award, 
  AlertTriangle, 
  User, 
  LogOut,
  X,
  BookOpen
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();

  const getNavigation = () => {
    if (currentUser?.role === 'mentor') {
      return [
        { name: 'Dashboard', path: '/mentor/dashboard', icon: LayoutDashboard },
        { name: 'Students', path: '/mentor/students', icon: Users },
        { name: 'Add Student', path: '/mentor/add-student', icon: UserPlus },
        { name: 'Academic Resources', path: '/mentor/resources', icon: BookOpen },
        { name: 'Assignments', path: '/mentor/assignments', icon: FolderGit2 },
        { name: 'Complaints', path: '/mentor/complaints', icon: AlertTriangle },
        { name: 'Profile', path: '/mentor/profile', icon: User }
      ];
    } else {
      return [
        { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', path: '/student/profile', icon: User },
        { name: 'Academic Resources', path: '/student/resources', icon: BookOpen },
        { name: 'Assignments', path: '/student/assignments', icon: FolderGit2 },
        { name: 'Complaints', path: '/student/complaints', icon: AlertTriangle }
      ];
    }
  };

  const navItems = getNavigation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white px-4 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold">
              MC
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">PVKK Student E-Portal</h1>
              <span className="text-xs text-gray-500 font-medium">Online Student Platform</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => 
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/5' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / User Session */}
        <div className="border-t border-gray-100 pt-4 mt-auto">
          <div className="flex items-center gap-3 px-2 py-1.5 mb-4">
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name} 
              className="h-9 w-9 rounded-full border border-gray-200 object-cover"
            />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-semibold text-gray-900">{currentUser?.name}</p>
              <p className="truncate text-[10px] uppercase font-bold tracking-wider text-gray-400">
                {currentUser?.role}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
