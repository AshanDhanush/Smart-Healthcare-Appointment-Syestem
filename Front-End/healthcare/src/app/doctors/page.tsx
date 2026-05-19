"use client";

import Navbar from "@/components/Navbar";
import { Search, MapPin, Stethoscope, Clock, Award, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// --- PAYLOAD STRUCTURAL INTERFACES ---
interface Shift {
    day: string;
    startTime: string;
    endTime: string;
}

interface Doctor {
    email: string;
    firstName: string;
    lastName: string;
    specialization: string;
    departmentCode: string;
    roomNumber: string;
    experience: string;
    availability: Shift[]; // Synced with new dynamic nested shift properties
}

export default function DoctorSearchPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState("ALL");
    const [selectedDepartment, setSelectedDepartment] = useState("ALL");
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // --- BACKEND SERVICE SYNC DATA ---
    const fetchDoctorsList = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            // Fetch directly from your port 8080 Auth/User registry service
            const response = await axios.get("http://localhost:8080/api/auth/get/doctors");
            setDoctors(response.data);
            setFilteredDoctors(response.data);
        } catch (err) {
            console.error("Failed to sync doctors list database values:", err);
            setError("Unable to download the clinical directory right now. Please ensure services are active.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDoctorsList();
    }, [fetchDoctorsList]);

    // --- PIPELINE FILTER MATRIX ---
    useEffect(() => {
        const results = doctors.filter(doc => {
            const fullName = `${doc.firstName || ""} ${doc.lastName || ""}`.toLowerCase();
            const specializationText = (doc.specialization || "").toLowerCase();
            const query = searchTerm.toLowerCase();

            const matchesSearch = fullName.includes(query) || specializationText.includes(query);

            const matchesDept = selectedDepartment === 'ALL' || selectedDepartment === "" || 
                                doc.departmentCode === selectedDepartment;

            const matchesSpec = selectedSpecialization === 'ALL' || selectedSpecialization === "" || 
                                doc.specialization === selectedSpecialization;

            return matchesSearch && matchesDept && matchesSpec;
        });

        setFilteredDoctors(results);
    }, [searchTerm, selectedDepartment, selectedSpecialization, doctors]);

    // --- FAIL-SAFE DATA RENDER HELPER ---
    const renderAvailabilityText = (availability: any) => {
        if (!availability || availability.length === 0) return "Off Duty / Call Center";
        
        // Handle structured complex timed shift objects
        if (typeof availability[0] === 'object' && availability[0] !== null) {
            return availability.map((shift: Shift) => `${shift.day?.substring(0, 3)} (${shift.startTime}-${shift.endTime})`).join(", ");
        }
        
        // Fallback for simple string array data structures
        if (Array.isArray(availability)) {
            return availability.join(", ");
        }
        
        return "Not Specified";
    };

    return (
        <div className="flex flex-col">
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-3 tracking-tight">
                            Find the Right Doctor
                        </h1>
                        <p className="text-slate-600 text-lg font-medium">
                            Search by name, specialty, or department to find your perfect care.
                        </p>
                    </div>
                    
                    {/* Search Bar and Filters */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white p-6 mb-8 sticky top-4 z-10 hover:shadow-xl transition-all duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            
                            {/* Search Input */}
                            <div className="md:col-span-1 group">
                                <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Doctor name or specialization"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all hover:border-blue-300 bg-white/50 focus:bg-white text-slate-700 placeholder-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Department Filter */}
                            <div className="md:col-span-1 group">
                                <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Department</label>
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all hover:border-blue-300 bg-white/50 focus:bg-white text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="ALL">All Departments</option>
                                    <option value="CARD">Cardiology</option>
                                    <option value="SURG">Surgery</option>
                                    <option value="NEUR">Neurology</option>
                                    <option value="PEDS">Pediatrics</option>
                                    <option value="ORTH">Orthopedics</option>
                                </select>
                            </div>

                            {/* Specialization Filter */}
                            <div className="md:col-span-1 group">
                                <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Specialization</label>
                                <select
                                    value={selectedSpecialization}
                                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all hover:border-blue-300 bg-white/50 focus:bg-white text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="ALL">All Specializations</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrician">Pediatrics</option>
                                    <option value="Sports Medicine">Orthopedics</option>
                                    <option value="General Surgery">General Surgery</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Count & Loader Notification View */}
                    <div className="mb-5 flex items-center justify-between">
                        {loading ? (
                            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                <Loader2 className="animate-spin text-blue-600" size={18} />
                                <span>Querying live database indexes...</span>
                            </div>
                        ) : (
                            <p className="text-slate-600 font-medium">
                                <span className="text-blue-600 font-bold text-lg">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''} found
                            </p>
                        )}
                    </div>

                    {error && <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium mb-6">{error}</div>}

                    {/* Doctor Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor.email}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 border border-slate-100 p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden flex flex-col h-full"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                
                                <div className="flex justify-center mb-5 relative z-10">
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                        <Stethoscope className="w-14 h-14 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                </div>

                                <div className="text-center mb-6 relative z-10 flex-grow">
                                    <h3 className="text-xl font-bold text-slate-800 mb-1.5 group-hover:text-blue-600 transition-colors">
                                        Dr. {doctor.firstName} {doctor.lastName}
                                    </h3>
                                    <p className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4 border border-blue-100">
                                        {doctor.specialization || "General Staff"}
                                    </p>
                                    
                                    <div className="space-y-2.5 text-slate-600 text-sm font-medium bg-slate-50 rounded-xl p-4 group-hover:bg-white group-hover:shadow-sm transition-all text-left">
                                        <div className="flex items-start gap-2">
                                            <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-xs">{renderAvailabilityText(doctor.availability)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                            <span>Room: {doctor.roomNumber || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                            <span>Experience: {doctor.experience ? `${doctor.experience} Years` : "Not Stated"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-3 relative z-10 mt-auto">
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 font-semibold">
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* No Results Message */}
                        {!loading && filteredDoctors.length === 0 && (
                            <div className="md:col-span-2 lg:col-span-3 text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-12 h-12 text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No doctors found</h3>
                                <p className="text-slate-600 text-lg">Try adjusting your search filters to narrow down parameters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}