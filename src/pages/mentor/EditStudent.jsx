import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardContent } from '../../components/common/Card';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, User, Users, MapPin } from 'lucide-react';

export const EditStudent = () => {
  const { rollNo } = useParams();
  const navigate = useNavigate();
  const { students, updateStudent } = useData();

  const student = students.find(s => s.rollNumber === rollNo);

  // Active form section tab
  const [activeSection, setActiveSection] = useState('basic');

  // Form State
  const [formData, setFormData] = useState(null);

  // Populate data on load
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        gender: student.gender,
        dob: student.dob,
        bloodGroup: student.bloodGroup || 'O+',
        branch: student.branch,
        specialization: student.specialization || 'General',
        joiningType: student.joiningType || 'Regular',
        joiningYear: student.joiningYear || '2022',
        passingYear: student.passingYear || '2026',
        parentDetails: { ...student.parentDetails },
        contactInfo: { ...student.contactInfo }
      });
    }
  }, [student, rollNo]);

  if (!formData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-gray-900">Loading Student details...</h2>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      parentDetails: {
        ...formData.parentDetails,
        [name]: value
      }
    });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      contactInfo: {
        ...formData.contactInfo,
        [name]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check basic details
    if (!formData.name.trim() || !formData.dob) {
      toast.error("Name and Date of Birth are required fields.");
      return;
    }

    // Check contact details
    if (!formData.contactInfo.email.trim() || !formData.contactInfo.phone.trim()) {
      toast.error("Email and Phone Number are required fields.");
      return;
    }

    updateStudent(rollNo, formData);
    toast.success(`Successfully updated profile records for ${formData.name}!`);
    navigate(`/mentor/students/${rollNo}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back CTA and Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/mentor/students/${rollNo}`)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Student Record</h1>
          <p className="text-xs text-gray-500 font-medium">Modify administrative, contact, and profile details for {student.name}.</p>
        </div>
      </div>

      {/* Editor Section Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'basic', name: 'Basic & Academics', icon: User },
          { id: 'parents', name: 'Parent details', icon: Users },
          { id: 'contact', name: 'Contact & Address', icon: MapPin }
        ].map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeSection === s.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {s.name}
            </button>
          );
        })}
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Basic & Academic Fields */}
            {activeSection === 'basic' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Academic & Personal Profile</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 font-mono">Roll Number (ReadOnly)</label>
                    <input
                      type="text"
                      disabled
                      value={student.rollNumber}
                      className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed font-semibold"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Branch</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Joining Type</label>
                    <select
                      name="joiningType"
                      value={formData.joiningType}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Lateral Entry">Lateral Entry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Joining Year</label>
                    <input
                      type="number"
                      name="joiningYear"
                      value={formData.joiningYear}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Passing Year</label>
                    <input
                      type="number"
                      name="passingYear"
                      value={formData.passingYear}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Parents Fields */}
            {activeSection === 'parents' && (
              <div className="space-y-6">
                {/* Father */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Father's Information</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Father's Name</label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.parentDetails.fatherName}
                        onChange={handleParentChange}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Occupation</label>
                      <input
                        type="text"
                        name="fatherOccupation"
                        value={formData.parentDetails.fatherOccupation}
                        onChange={handleParentChange}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="fatherPhone"
                        value={formData.parentDetails.fatherPhone}
                        onChange={handleParentChange}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Mother */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Mother's Information</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Mother's Name</label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.parentDetails.motherName}
                        onChange={handleParentChange}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Occupation</label>
                      <input
                        type="text"
                        name="motherOccupation"
                        value={formData.parentDetails.motherOccupation}
                        onChange={handleParentChange}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="motherPhone"
                        value={formData.parentDetails.motherPhone}
                        onChange={handleParentChange}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Guardian */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Guardian's Information</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Guardian's Name</label>
                      <input
                        type="text"
                        name="guardianName"
                        value={formData.parentDetails.guardianName}
                        onChange={handleParentChange}
                        placeholder="Optional"
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Occupation</label>
                      <input
                        type="text"
                        name="guardianOccupation"
                        value={formData.parentDetails.guardianOccupation}
                        onChange={handleParentChange}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="guardianPhone"
                        value={formData.parentDetails.guardianPhone}
                        onChange={handleParentChange}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Contact & Address Fields */}
            {activeSection === 'contact' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Contact Details</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.contactInfo.email}
                      onChange={handleContactChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.contactInfo.phone}
                      onChange={handleContactChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Permanent Home Address</label>
                  <textarea
                    name="address"
                    required
                    rows={4}
                    value={formData.contactInfo.address}
                    onChange={handleContactChange}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end items-center border-t border-gray-100 pt-4 mt-6">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
