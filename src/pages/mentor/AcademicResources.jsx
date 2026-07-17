import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  Calendar, 
  Download, 
  Plus, 
  Trash2, 
  FileText, 
  User, 
  X, 
  Clock, 
  Upload 
} from 'lucide-react';

export const AcademicResources = ({ isReadOnly = false }) => {
  const { currentUser } = useAuth();
  const { timetable, notes, uploadNote, deleteNote } = useData();

  const [activeTab, setActiveTab] = useState('notes');
  const [activeDay, setActiveDay] = useState('Monday');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [noteForm, setNoteForm] = useState({ subject: 'Data Structures', fileName: '', faculty: currentUser?.name || 'Dr. Rajesh Kumar' });

  // Handle mock download
  const handleDownload = (fileName) => {
    toast.success(`Downloading file: ${fileName}...`);
  };

  // Handle mock note submission
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!noteForm.fileName.trim()) {
      toast.error("Please enter a file name");
      return;
    }
    const filenameWithExt = noteForm.fileName.endsWith('.pdf') ? noteForm.fileName : `${noteForm.fileName}.pdf`;
    uploadNote({
      subject: noteForm.subject,
      fileName: filenameWithExt,
      faculty: noteForm.faculty
    });
    toast.success("Lecture note uploaded successfully!");
    setShowUploadModal(false);
    setNoteForm({ subject: 'Data Structures', fileName: '', faculty: currentUser?.name || 'Dr. Rajesh Kumar' });
  };

  const handleDeleteNote = (noteId) => {
    deleteNote(noteId);
    toast.success("Lecture note deleted!");
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Academic Resources</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Access weekly timetables and lecture notes materials.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'notes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'
          }`}
        >
          <FileText size={16} />
          Lecture Notes
        </button>
        <button
          onClick={() => setActiveTab('timetable')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'timetable'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'
          }`}
        >
          <Calendar size={16} />
          Weekly Timetable
        </button>
      </div>

      {/* Content tabs */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Lecture Notes Archive</h3>
            {!isReadOnly && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Upload size={14} />
                Upload Note
              </button>
            )}
          </div>

          {notes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <p className="text-sm text-gray-500 font-medium">No lecture notes uploaded yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map(note => (
                <Card key={note.id} className="flex flex-col justify-between hover:shadow-md transition-all">
                  <CardContent className="p-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h4 className="font-bold text-gray-900 text-xs truncate" title={note.fileName}>{note.fileName}</h4>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold inline-block mt-1">
                          {note.subject}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-gray-400 space-y-0.5 pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <User size={10} />
                        <span>Uploaded by: {note.faculty}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span>Date: {note.date}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
                    <button
                      onClick={() => handleDownload(note.fileName)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Download size={14} />
                      Download
                    </button>

                    {!isReadOnly && (
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                        title="Delete notes"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="space-y-6">
          {/* Day selection */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                  activeDay === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Timetable schedule grid */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{activeDay}'s Schedule</CardTitle>
              {!isReadOnly && (
                <Badge variant="info">Editable Mode</Badge>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {(!timetable[activeDay] || timetable[activeDay].length === 0) ? (
                <div className="p-8 text-center text-sm text-gray-500">No classes scheduled on {activeDay}.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {timetable[activeDay].map((slot, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-gray-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 leading-snug">{slot.subject}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{slot.faculty} • {slot.room}</p>
                        </div>
                      </div>
                      <Badge variant="primary" className="self-start sm:self-auto font-mono text-[10px]">
                        {slot.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload notes modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Upload Lecture Note</h3>
              <button onClick={() => setShowUploadModal(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Subject</label>
                <select
                  value={noteForm.subject}
                  onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
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
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={noteForm.fileName}
                  onChange={(e) => setNoteForm({ ...noteForm, fileName: e.target.value })}
                  placeholder="e.g. 05_Graph_Algorithms"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1 font-mono">Faculty (Author)</label>
                <input
                  type="text"
                  disabled
                  value={noteForm.faculty}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 font-semibold cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
