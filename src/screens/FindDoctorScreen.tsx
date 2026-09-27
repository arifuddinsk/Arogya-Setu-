import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Languages,
  BadgeIndianRupee,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_DOCTORS } from '../data/mockData';
import { Doctor } from '../types';

export const FindDoctorScreen: React.FC = () => {
  const { navigateTo, setSelectedDoctor, showToast, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  const specializations = [
    'All',
    'General Physician',
    'Pediatrician (Child Specialist)',
    'Cardiologist',
    'Gynecologist & Obstetrician',
  ];

  const locations = ['All', 'Varanasi', 'Lucknow Tele-Link'];

  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    const matchQuery =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSpec =
      selectedSpecialization === 'All' || doc.specialization === selectedSpecialization;

    const matchLoc =
      selectedLocation === 'All' || doc.district.includes(selectedLocation);

    const matchAvail =
      selectedAvailability === 'All' || doc.availability.includes(selectedAvailability);

    return matchQuery && matchSpec && matchLoc && matchAvail;
  });

  const handleBook = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigateTo('appointment-booking');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('findDoctor')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Consult qualified government & private doctors verified for rural telemedicine.
          </p>
        </div>

        {/* Search & Filter Controls (Requested in prompt: Specialization, Location, Availability) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
          {/* Main search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-teal-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Doctor by name, symptoms (e.g. fever, chest pain), or hospital..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Specialization Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('specialization')}
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('location')} / District
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('availability')}
              </label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="All">All Availabilities</option>
                <option value="Available Today">Available Today</option>
                <option value="Tomorrow">Tomorrow</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctor List Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Showing {filteredDoctors.length} Verified Tele-Doctors</span>
            <span>ABHA Network Tele-Hub</span>
          </div>

          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-teal-300 p-5 transition-all hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Doctor Bio */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-100 shadow-sm"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-bold">
                      Verified
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ★★★★★ {doc.rating} ({doc.reviewsCount})
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-teal-700">
                      {doc.specialization}
                    </p>

                    <p className="text-xs text-slate-500">
                      {doc.qualification} • {doc.experienceYears} Years Experience
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {doc.hospital} ({doc.district})
                      </span>
                      <span className="flex items-center gap-1">
                        <Languages className="w-3.5 h-3.5 text-slate-400" />
                        {doc.languages.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Block (Requested CTA: [Book Appointment]) */}
                <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                    <div className="text-xs text-slate-500">Consultation Fee</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-black text-slate-900">
                        ₹{doc.consultationFee}
                      </span>
                      {doc.isBPLFree && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Free for BPL/Ayushman
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Next: {doc.nextSlot}</span>
                  </div>

                  <button
                    onClick={() => handleBook(doc)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 hover:shadow-teal-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t('bookAppointment')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-slate-500 text-sm">
                No doctors found matching your filter criteria. Try adjusting your query.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialization('All');
                  setSelectedLocation('All');
                  setSelectedAvailability('All');
                }}
                className="mt-3 text-xs font-bold text-teal-700 hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
