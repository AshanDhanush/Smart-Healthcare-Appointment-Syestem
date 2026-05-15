"use client"

import React, { use, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Check, User , ChevronLeft, ChevronRight, Calendar} from 'lucide-react';
import { motion} from 'framer-motion';
import axios from 'axios';

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
    departmentCode: DepartmentCode;
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
enum DepartmentCode {
    CARD = "CARD",
    NEUR = "NEUR",
    PEDS = "PEDS",
    ORTH = "ORTH",
    SURG = "SURG"
}


export default function Book() {
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctors | null>(null);
    const [doctors, setDoctors] = useState<Doctors[]>([]);
    const [error , setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [appointmentNumber, setAppointmentNumber] = useState<number>(0);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    

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
                const response = await axios.get(`http://localhost:8084/api/appointments/check/availability?date=${selectedDate},doctorEmail=${selectedDoctor?.email}`);
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
        // Handle appointment booking submission
        console.log('Booking appointment:', {
            doctor: selectedDoctor,
            date: selectedDate,
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            {/* Background Decorative Elements */}
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-linear-to-tr from-blue-100 to-teal-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

            <Navbar />

            {/* Header Section */}
            <header className="py-12 px-6 text-center mt-20">
                <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-cyan-700 to-blue-500 bg-clip-text text-transparent">
                    Find your doctor, pick your time, and confirm your session in seconds
                </h1>
                <p className="text-xl mt-8 font-sans text-cyan-500">
                    Complete these steps to confirm your preferred specialist session
                </p>

            </header>

            <main className="max-w-4xl mx-auto px-6 pb-24">
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

                <div className="bg-slate-200 border border-slate-300 rounded-3xl p-8 md:p-12 shadow-2xl w-full">
                     {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
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
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
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
                                                                        <h4 className="font-bold text-lg">{doctor.firstName} {doctor.lastName}</h4>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div>
            <h2 className="text-2xl font-bold text-sky-500 mb-6 flex items-center gap-2">
                <Calendar className="text-cyan-600" /> Pick a Date & Get Number
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
    </div>
)}
                     {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col justify-center items-center"
                        >
                            <h2 className="text-2xl font-bold text-sky-500 mb-8">Confirm Your Booking</h2>
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
                              {/* Navigation Buttons */}
                                <div className="flex justify-between mt-12">
                                    {error && (
                                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                                            {error}
                                        </div>
                                    )}
                                    <button
                                        disabled={step === 1}
                                        onClick={() => setStep(step - 1)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "hover:bg-blue-600 text-slate-700 hover:text-slate-100"
                                            }`}
                                    >
                                        <ChevronLeft size={20} /> Back
                                    </button>

                                    <button
                                        disabled={(step === 1 && !selectedDoctor) || (step === 2 && (!selectedDate))}
                                        onClick={() => {
                                            if (step === 3) {
                                                handleSubmit();
                                            } else {
                                                setStep(step + 1);
                                            }
                                        }}
                                        className="flex items-center gap-2 px-10 py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {step === 3 ? "Confirm Booking" : "Next Step"} <ChevronRight size={20} />
                                    </button>
                                </div>

                </div>

            </main>




       </div>
    );
}