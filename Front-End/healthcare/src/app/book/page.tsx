"use client"

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Check, User , ChevronLeft, ChevronRight, Calendar} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRouter';
import { select } from 'framer-motion/client';
import { useRouter } from 'next/navigation';

interface Doctors {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    dateOfBirth?: string;
    gender: Gender;
    phoneNumber: string;
    address: string;
    role: Role;
    specialization: string;
    departmentCode: string;
    availability: string[];
    roomNumber: string;
    experience: string;
}

enum Role {
    PATIENT = "PATIENT",
    DOCTOR = "DOCTOR",
    ADMIN = "ADMIN"
}

enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}



export default function Book() {
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctors | null>(null);
    const [doctors, setDoctors] = useState<Doctors[]>([]);
    const [error , setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const { user } = useAuth();
    const router = useRouter();
    

    const calculateAppointmentPrice = (specialization: string, experience: string | number): number => {
        const basePrice = 1000;
        let specializationMultiplier = 1;
        let experienceMultiplier = 1;
        const expNum = typeof experience === 'number' ? experience : Number(experience);
        const validExp = Number.isFinite(expNum) && expNum >= 0 ? expNum : 0;

        if (specialization === 'Cardiology') {
            specializationMultiplier = 1.5;
        } else if (specialization === 'Neurology') {
            specializationMultiplier = 1.3;
        }else if (specialization === 'Pediatrics') {
            specializationMultiplier = 1.2;
        } else if (specialization === 'Orthopedics') {
            specializationMultiplier = 1.1;
        }else if (specialization === 'General Surgery') {
            specializationMultiplier = 1.4;
        }   

        if (validExp > 10) {
            experienceMultiplier = 1.2;
        } else if (validExp >= 5) {
            experienceMultiplier = 1.1;
        } else {
            experienceMultiplier = 1;
        }

        return basePrice * specializationMultiplier * experienceMultiplier;
    };

    useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDate) return;

            setLoadingSlots(true);
            try {
               const response = await axios.get(`http://localhost:8080/api/appointments/check/availability?date=${selectedDate}&doctorEmail=${selectedDoctor?.email}`,{ withCredentials: true });
                const data = response.data;
                setAvailableSlots(data);
            } catch (error) {
                console.error("Error fetching availability:", error);
            } finally {
                setLoadingSlots(false);
            }
        };
        
        fetchSlots();
    }, [selectedDate, selectedDoctor]); 

    
    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:8080/api/auth/get/doctors');
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError('Failed to fetch doctors');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleSubmit = async () => {
        if (!selectedDoctor || !selectedDate) {
            setError('Please select a doctor and date before confirming your booking.');
            return;
        }

        setError(null);
        setSuccessMessage(null);
        setSubmitting(true);

        const bookingDetails = {
            patientName: user ? `${user.firstName} ${user.lastName}` : 'Guest User',
            patientEmail: user?.email || null,
            doctorName: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
            doctorEmail: selectedDoctor.email,
            doctorSpecialization: selectedDoctor.specialization,
            dpartmentCode: selectedDoctor.departmentCode,
            roomNumber:selectedDoctor.roomNumber,
            price: calculateAppointmentPrice(selectedDoctor.specialization, selectedDoctor.experience),
            date: selectedDate,
            departmentCode: selectedDoctor.departmentCode,

        };

        try {
            const response = await axios.post(
                'http://localhost:8080/api/appointments/add',
                bookingDetails,
                { withCredentials: true }
            );

            const createdAppointment = response.data;
            if (createdAppointment==false) {
                setError('Selected time slot is no longer available. Please choose a different date or doctor.');
                return;
            }else{
            setSuccessMessage('Your booking has been sent successfully.');
            setError(null);
            }
            router.push("/patientDashboard");
            
        } catch (submitError) {
            console.error('Error submitting booking:', submitError);
            setError('Failed to submit booking. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col">
                <Navbar />
                <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 mt-15">
                    <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <motion.header 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-600 mb-3 tracking-tight">
                            Find your doctor, pick your time, and confirm your session in seconds
                        </h1>
                        <p className="text-slate-600 text-lg font-medium">
                            Complete these steps to confirm your preferred specialist session
                        </p>

                    </motion.header>

                    <main className="px-4 pb-24 mt-10">
                    {/* Progress Bar Fixes */}
                    <div className="flex justify-between mb-12 relative">
                        <div className="absolute  top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= s ? "bg-cyan-600 text-white" : "bg-white text-slate-400 border border-slate-200"
                                    }`}
                            >
                                {step > s ? <Check size={20} /> : s}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white p-6 md:p-8 w-full overflow-x-hidden">
                        <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="flex flex-col justify-center items-center"
                            >
                                <h2 className="text-2xl font-bold text-sky-500 mb-8 flex items-center gap-3">
                                    <User size={24} className="inline-block mr-2 text-slate-800" />
                                    Select Your Doctor

                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="specialization" className="block text-sm font-medium text-slate-700 mb-2">
                                            Choose a specialization
                                        </label>
                                        <select
                                            id="specialization"
                                            name="specialization"
                                            value={selectedSpecialization}
                                            onChange={(e) => {
                                                setSelectedSpecialization(e.target.value);
                                                setSelectedDoctor(null);
                                            }}
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all hover:border-blue-300 bg-white/50 focus:bg-white text-slate-700 appearance-none cursor-pointer"
                                        >
                                            <option value="">Choose a specialization</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Orthopedics">Orthopedics</option>
                                            <option value="General Surgery">General Surgery</option>
                                        </select>
                                    </div>

                                    {selectedSpecialization && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-sky-500 mb-4">Available Doctors:</h3>
                                            {doctors.filter((doctor) => doctor.specialization === selectedSpecialization).length > 0 ? (
                                                <div className="grid gap-4">
                                                    {doctors
                                                        .filter((doctor) => doctor.specialization === selectedSpecialization)
                                                        .map((doctor) => (
                                                            <button
                                                                key={doctor.email}
                                                                type="button"
                                                                onClick={() => setSelectedDoctor(doctor)}
                                                                className={`w-full text-left p-4 rounded-3xl border transition-shadow duration-200 ${selectedDoctor?.email === doctor.email ? 'border-cyan-600 bg-cyan-600 text-white shadow-xl' : 'border-slate-200 bg-white text-slate-800 hover:shadow-lg'}`}
                                                            >
                                                                <div className="flex items-center justify-between gap-3">
                                                                    <div>
                                                                        <h4 className="font-bold text-lg">Dr.{doctor.firstName} {doctor.lastName}</h4>
                                                                        <p className="text-sm text-slate-500">{doctor.specialization}</p>
                                                                    </div>
                                                                    <span className="text-sm font-semibold">View</span>
                                                                </div>
                                                                <p className="mt-3 text-sm text-slate-600">Department: {doctor.departmentCode}</p>
                                                            </button>
                                                        ))}
                                                </div>
                                            ) : (
                                                <p className="text-slate-500">No doctors found for this specialization.</p>
                                            )}

                                            {selectedDoctor && (
                                                <div className="mt-6 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                                                    <h4 className="text-xl font-semibold text-slate-800 mb-3">Selected Doctor Details</h4>
                                                    <p className="text-slate-700"><span className="font-semibold">Name:</span> {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                                                    <p className="text-slate-700"><span className="font-semibold">Specialization:</span> {selectedDoctor.specialization}</p>
                                                    <p className="text-slate-700"><span className="font-semibold">Department:</span> {selectedDoctor.departmentCode}</p>
                                                    <p className="text-slate-700"><span className="font-semibold">Availability:</span> {selectedDoctor.availability?.join(', ') || 'Not available'}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>





                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <div>
                                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Calendar className="text-blue-600" /> Pick a Date & Get Number
                                    </h2>
                                    <p className="text-slate-600 mb-4">
                                        Booking with <span className="text-cyan-700 font-bold">Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}</span>
                                    </p>

                                    {/* Displaying Doctor's Schedule */}
                                    <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100">
                                        <p className="text-xs font-bold text-cyan-600 uppercase mb-1">Doctor's Schedule</p>
                                        <p className="text-cyan-800 font-medium">
                                            {selectedDoctor?.availability?.join(', ') || 'Consultation schedule pending'}
                                        </p>
                                    </div>

                                    {/* Backend Availability Message */}
                                    {availableSlots && typeof availableSlots === 'string' && (
                                        <div className="mt-4 p-3 bg-white border-l-4 border-cyan-500 shadow-sm rounded-r-xl">
                                            <p className="text-sm text-slate-700 font-semibold">{availableSlots}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-slate-500 text-xs font-bold uppercase tracking-widest">Select Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl text-slate-800 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all cursor-pointer shadow-sm"
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="flex flex-col justify-center items-center"
                            >
                                <h2 className="text-2xl font-bold text-slate-800 mb-8">Confirm Your Booking</h2>
                                <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                                    <div>
                                        <p className="text-sm text-slate-500">Doctor</p>
                                        <p className="text-lg font-semibold text-slate-800">
                                            {selectedDoctor?.firstName} {selectedDoctor?.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Specialization</p>
                                        <p className="text-lg font-semibold text-slate-800">
                                            {selectedDoctor?.specialization}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Date</p>
                                        <p className="text-lg font-semibold text-slate-800">{selectedDate}</p>
                                    </div>
                                </div>

                            </motion.div>
                        )}
                        </AnimatePresence>
                        {/* Navigation Buttons */}
                        <div className="flex flex-col gap-4 mt-12">
                            {error && (
                                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-700">
                                    {successMessage}
                                </div>
                            )}
                            <div className="flex justify-between">
                                <button
                                    disabled={step === 1}
                                    onClick={() => setStep(step - 1)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "hover:bg-blue-600 text-slate-700 hover:text-slate-100"
                                        }`}
                                >
                                    <ChevronLeft size={20} /> Back
                                </button>

                                        <button
                                    disabled={submitting || (step === 1 && !selectedDoctor) || (step === 2 && (!selectedDate))}
                                    onClick={() => {
                                        if (step === 3) {
                                            handleSubmit();
                                        } else {
                                            setStep(step + 1);
                                        }
                                    }}
                                            className="flex items-center gap-2 px-10 py-3 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {step === 3 ? (submitting ? 'Sending...' : 'Confirm Booking') : 'Next Step'} <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                </main>

                </div>

            </div>

            </div>

        </ProtectedRoute>
        
    );
}