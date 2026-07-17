import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { dummyMentor } from '../../data/mentor';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Mail, Phone, MapPin, Award, BookOpen, Clock, Calendar } from 'lucide-react';

export const MentorProfile = () => {
  const { currentUser } = useAuth();
  
  // Use dummy mentor data
  const mentor = dummyMentor;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner / Avatar card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
        <img 
          src={mentor.avatar} 
          alt={mentor.name} 
          className="h-24 w-24 rounded-2xl border-2 border-gray-100 object-cover shadow-sm"
        />
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-gray-900">{mentor.name}</h1>
          <p className="text-sm font-semibold text-gray-500">{mentor.designation}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="primary">{mentor.department}</Badge>
            <Badge variant="info">Specialist in AI</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Contact Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex gap-3 items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Email Address</span>
                <p className="font-semibold text-gray-800 mt-0.5">{mentor.email}</p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Phone size={18} />
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Mobile Number</span>
                <p className="font-semibold text-gray-800 mt-0.5">{mentor.phone}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Office Address</span>
                <p className="font-semibold text-gray-800 mt-0.5 leading-relaxed">{mentor.officeAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Metadata Card */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex gap-3 items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
                <Calendar size={18} />
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Joined Campus</span>
                <p className="font-semibold text-gray-800 mt-0.5">Class of {mentor.joinedYear}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600 shrink-0">
                <Award size={18} />
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Specializations</span>
                <p className="font-semibold text-gray-800 mt-0.5 leading-relaxed">{mentor.specialization}</p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
                <BookOpen size={18} />
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Mentees Enrolled</span>
                <p className="font-semibold text-gray-800 mt-0.5">{mentor.assignedStudents.length} Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
