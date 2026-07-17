import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardContent } from '../../components/common/Card';
import toast from 'react-hot-toast';
import { 
  User, 
  Users, 
  MapPin, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  UserCheck,
  ChevronRight
} from 'lucide-react';

export const AddStudent = () => {
  const { addStudent } = useData();
  const navigate = useNavigate();

  // Active step: 1 (Basic/Academic), 2 (Parents), 3 (Contact)
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    gender: 'Male',
    dob: '',
    bloodGroup: 'O+',
    branch: 'Computer Science & Engineering',
    specialization: 'General',
    joiningType: 'Regular',
    joiningYear: new Date().getFullYear().toString(),
    passingYear: (new Date().getFullYear() + 4).toString(),
    parentDetails: {
      fatherName: '',
      fatherOccupation: '',
      fatherPhone: '',
      motherName: '',
      motherOccupation: '',
      motherPhone: '',
      guardianName: '',
      guardianOccupation: '',
      guardianPhone: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    }
  });

  // Handler for simple inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for nested parents details
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

  // Handler for nested contact info
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

  const handleNext = () => {
    // Validate Step 1
    if (step === 1) {
      if (!formData.name.trim() || !formData.rollNumber.trim() || !formData.dob) {
        toast.error("Please fill in Name, Roll Number, and Date of Birth");
        return;
      }
    }
    // Validate Step 2
    if (step === 2) {
      if (!formData.parentDetails.fatherName.trim() || !formData.parentDetails.motherName.trim()) {
        toast.error("Please enter Father's and Mother's names");
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate Step 3
    if (!formData.contactInfo.email.trim() || !formData.contactInfo.phone.trim() || !formData.contactInfo.address.trim()) {
      toast.error("Please complete all contact details");
      return;
    }

    const res = addStudent(formData);
    if (res.success) {
      toast.success("Student profile created successfully!");
      navigate('/mentor/students');
    } else {
      toast.error(res.message || "Failed to create student profile.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button and title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/mentor/students')}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Student</h1>
          <p className="text-xs text-gray-500 font-medium">Create a digital academic profile for a new student enrollee.</p>
        </div>
      </div>

      {/* Progress Wizard Header */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-xs font-semibold text-gray-500">
        {[
          { num: 1, name: 'Basic & Academics', icon: User },
          { num: 2, name: 'Parent details', icon: Users },
          { num: 3, name: 'Contact Info', icon: MapPin }
        ].map((s) => {
          const Icon = s.icon;
          const isCompleted = step > s.num;
          const isActive = step === s.num;
          return (
            <div key={s.num} className="flex items-center gap-2">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                isCompleted ? 'bg-green-100 text-green-700' :
                isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {s.num}
              </span>
              <Icon size={14} className={isActive ? 'text-blue-600' : isCompleted ? 'text-green-700' : 'text-gray-400'} />
              <span className={`hidden sm:inline ${isActive ? 'text-blue-600 font-bold' : isCompleted ? 'text-green-700' : ''}`}>
                {s.name}
              </span>
              {s.num !== 3 && <ChevronRight size={14} className="text-gray-300 mx-2" />}
            </div>
          );
        })}
      </div>

      {/* Form Wizard Body */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Basic & Academics */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Academic & Personal Info</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Roll Number / Student ID *</label>
                    <input
                      type="text"
                      name="rollNumber"
                      required
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder="e.g. 229X1A0501"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none uppercase"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Gender *</label>
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
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth *</label>
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
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Blood Group *</label>
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
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Branch *</label>
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
                      placeholder="e.g. Data Science / CyberSecurity"
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

            {/* STEP 2: Parent details */}
            {step === 2 && (
              <div className="space-y-6">
                
                {/* Father Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Father's Information</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        name="fatherName"
                        required
                        value={formData.parentDetails.fatherName}
                        onChange={handleParentChange}
                        placeholder="Father's Full Name"
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
                        placeholder="Occupation"
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
                        placeholder="+91 XXXXX XXXXX"
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Mother Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Mother's Information</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        name="motherName"
                        required
                        value={formData.parentDetails.motherName}
                        onChange={handleParentChange}
                        placeholder="Mother's Full Name"
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
                        placeholder="Occupation"
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
                        placeholder="+91 XXXXX XXXXX"
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Guardian Info (Optional) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Guardian's Information (Optional)</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="guardianName"
                        value={formData.parentDetails.guardianName}
                        onChange={handleParentChange}
                        placeholder="Guardian's Full Name"
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

            {/* STEP 3: Contact Details */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Contact Details</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.contactInfo.email}
                      onChange={handleContactChange}
                      placeholder="rahul@example.com"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.contactInfo.phone}
                      onChange={handleContactChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Permanent Home Address *</label>
                  <textarea
                    name="address"
                    required
                    rows={4}
                    value={formData.contactInfo.address}
                    onChange={handleContactChange}
                    placeholder="Enter complete postal/house address details..."
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Form Wizard Navigation Controls */}
            <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              ) : (
                <div></div> // empty spacer
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} />
                  Save Profile
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
