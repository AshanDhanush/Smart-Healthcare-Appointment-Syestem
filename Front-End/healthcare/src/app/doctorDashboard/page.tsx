"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
    Home,
    Calendar,
    User,
    LogOut,
    CheckCircle,
    XCircle,
    Clock,
    Trash2,
    Mail,
    Loader2,
    HeartPulse,
    Activity,
    MapPin,
    Phone,
    Briefcase,
    X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRouter";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED";

interface Shift {
    day: string;
    startTime: string;
    endTime: string;
}

interface Appointment {
    patientName: string;
    patientEmail: string;
    doctorName: string;
    doctorEmail: string;
    doctorSpecialization: string;
    departmentCode: string;
    roomNumber: string;
    appointmentFees: number;
    date: string; 
    appointmentNumber: number; 
    status: "PENDING" | "COMPLETED" | "CONFIRMED" | "CANCELED";
}

export default function DoctorDashboard() {
    const { user, logout, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<"home" | "appointments" | "profile">("home");
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Profile Management States
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formStatus, setFormStatus] = useState<string | null>(null);
    const [profileForm, setProfileForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || "",
        dateOfBirth: user?.dateOfBirth || "",
        gender: user?.gender || "",
        experience: user?.experience || "",
        availability: (user?.availability || []) as Shift[], 
    });

    // Dynamic fee calculator logic reflecting specialized healthcare multipliers
    const calculateAppointmentPrice = (specialization: string, experience: string | number): number => {
        const basePrice = 1000;
        let specializationMultiplier = 1;
        let experienceMultiplier = 1;
        const expNum = typeof experience === 'number' ? experience : Number(experience);
        const validExp = Number.isFinite(expNum) && expNum >= 0 ? expNum : 0;

        if (specialization === 'Cardiology') specializationMultiplier = 1.5;
        else if (specialization === 'Neurology') specializationMultiplier = 1.3;
        else if (specialization === 'Pediatrics') specializationMultiplier = 1.2;
        else if (specialization === 'Orthopedics') specializationMultiplier = 1.1;
        else if (specialization === 'General Surgery') specializationMultiplier = 1.4;

        if (validExp > 10) experienceMultiplier = 1.2;
        else if (validExp >= 5) experienceMultiplier = 1.1;

        return basePrice * specializationMultiplier * experienceMultiplier;
    };

    // Formats incoming string dates cleanly for UI presentation
    const formatDate = (dateString: string) => {
        try {
            const dateObj = new Date(dateString);
            return isNaN(dateObj.getTime()) 
                ? dateString 
                : dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return dateString;
        }
    };

    const fetchAppointments = useCallback(async () => {
        if (!user?.email) return;
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`http://localhost:8084/api/appointments/get/all`, {
                withCredentials: true,
            });

            // Filter active datasets matching this doctor's authenticated email signature
            const filtered = response.data.filter(
                (app: Appointment) => app.doctorEmail?.toLowerCase() === user.email.toLowerCase()
            );
            setAppointments(filtered);
        } catch (err: any) {
            console.error("Error running dataset fetch sequence:", err);
            setError("Failed to synchronize active appointment tracks with the server.");
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        if (user?.email) {
            fetchAppointments();
        }
    }, [user?.email, fetchAppointments]);

    // Update profile data contexts on live user state modifications
    useEffect(() => {
        setProfileForm({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phoneNumber: user?.phoneNumber || "",
            address: user?.address || "",
            dateOfBirth: user?.dateOfBirth || "",
            gender: user?.gender || "",
            experience: user?.experience || "",
            availability: (user?.availability || []) as Shift[],
        });
    }, [user]);

    const handleEditInput = (field: string, value: string) => {
        setProfileForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleDayCheckboxChange = (day: string, checked: boolean) => {
        setProfileForm((prev) => {
            let currentShifts = [...prev.availability];
            if (checked) {
                currentShifts.push({ day, startTime: "09:00", endTime: "17:00" });
            } else {
                currentShifts = currentShifts.filter((shift) => shift.day !== day);
            }
            return { ...prev, availability: currentShifts };
        });
    };

    const handleTimeChange = (day: string, field: "startTime" | "endTime", value: string) => {
        setProfileForm((prev) => {
            const updatedShifts = prev.availability.map((shift) => {
                if (shift.day === day) {
                    return { ...shift, [field]: value };
                }
                return shift;
            });
            return { ...prev, availability: updatedShifts };
        });
    };

    const editProfile = async () => {
        setFormError(null);
        setFormStatus(null);
        setActionLoading(true);

        try {
            const url = `http://localhost:8080/api/auth/update/profile?email=${encodeURIComponent(user?.email || "")}`;
            
            await axios.put(url, {
                firstName: profileForm.firstName,
                lastName: profileForm.lastName,
                dateOfBirth: profileForm.dateOfBirth || null,
                gender: profileForm.gender || null,
                phoneNumber: profileForm.phoneNumber,
                address: profileForm.address || null,
                experience: profileForm.experience,
                availability: profileForm.availability // Transmits natively as a clean structural JSON Array
            }, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            const updatedUser = { ...user, ...profileForm };
            if (typeof updateUser === "function") {
                updateUser(updatedUser);
            }

            setFormStatus('Clinical profile properties successfully saved to database.');
            setIsEditingProfile(false);
        } catch (err: any) {
            setFormError('Failed to synchronize profile changes with master authentication nodes.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleStatusChange = async (appointmentNumber: number, date: string, targetStatus: AppointmentStatus, patientEmail: string) => {
        setActionLoading(true);
        try {
            const formattedDate = new Date(date).toISOString().split("T")[0];
            const url = `http://localhost:8084/api/appointments/update/status` +
                `?appointmentNumber=${appointmentNumber}` +
                `&date=${formattedDate}` +
                `&status=${targetStatus}` +
                `&patientEmail=${encodeURIComponent(patientEmail)}` +
                `&doctorEmail=${encodeURIComponent(user?.email || "")}`;

            await axios.put(url, {}, { withCredentials: true });
            await fetchAppointments();
        } catch (err) {
            console.error("Failed executing status pipeline change:", err);
            alert("Error altering verification target states records.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (appointmentNumber: number, date: string) => {
        if (!window.confirm("Permanently cancel and delete this appointment documentation string from MongoDB?")) return;
        setActionLoading(true);
        try {
            const formattedDate = new Date(date).toISOString().split("T")[0];
            await axios.delete("http://localhost:8084/api/appointments/delete", {
                data: {
                    appointmentNumber,
                    date: formattedDate,
                    doctorEmail: user?.email
                },
                withCredentials: true
            });
            await fetchAppointments();
        } catch (err) {
            console.error("Deletion mapping break:", err);
            alert("Error invoking database dropping pipeline loops.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">

                {/* SIDE NAVIGATION */}
                <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shadow-xl">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg shadow-cyan-500/20">
                                <HeartPulse size={24} />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">HealthSync</span>
                        </div>

                        <nav className="space-y-2 mt-8">
                            <button
                                type="button"
                                onClick={() => setActiveTab("home")}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "home" ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
                            >
                                <Home size={20} /> Home
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("appointments")}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "appointments" ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
                            >
                                <Calendar size={20} /> Appointments
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "profile" ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
                            >
                                <User size={20} /> Profile
                            </button>
                        </nav>
                    </div>

                    <div className="p-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-400 border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                        >
                            <LogOut size={20} /> Sign Out
                        </button>
                    </div>
                </aside>

                {/* MAIN SPACE FRAME CONTAINER */}
                <main className="flex-1 overflow-y-auto p-10 relative">
                    {loading && (
                        <div className="absolute top-5 right-5 z-50 bg-slate-950/80 border border-slate-800 backdrop-blur-sm shadow-xl px-4 py-2 rounded-full flex items-center gap-2 text-xs text-slate-300">
                            <Loader2 className="animate-spin text-cyan-500" size={14} /> Sync Pipeline...
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {/* TAB DISPLAY CONTENT: HOME */}
                        {activeTab === "home" && (
                            <motion.div
                                key="home"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight text-white">
                                        Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Dr. {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Specialist"}</span>
                                    </h1>
                                    <p className="text-slate-400 text-sm mt-1">Real-time clinical metrics matching your secure contextual route parameters.</p>
                                </div>

                                {/* METRICS CARD ROW */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-lg">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Booked Load</p>
                                            <h3 className="text-3xl font-black text-slate-100">{appointments.length}</h3>
                                        </div>
                                        <div className="p-4 bg-slate-900 border border-slate-800 text-cyan-500 rounded-xl"><Calendar size={24} /></div>
                                    </div>
                                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-lg">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Approved Clearances</p>
                                            <h3 className="text-3xl font-black text-emerald-500">{appointments.filter(a => a.status === "CONFIRMED").length}</h3>
                                        </div>
                                        <div className="p-4 bg-slate-900 border border-slate-800 text-emerald-500 rounded-xl"><CheckCircle size={24} /></div>
                                    </div>
                                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-lg">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Awaiting Active Triggers</p>
                                            <h3 className="text-3xl font-black text-amber-500">{appointments.filter(a => a.status === "PENDING").length}</h3>
                                        </div>
                                        <div className="p-4 bg-slate-900 border border-slate-800 text-amber-500 rounded-xl"><Clock size={24} /></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* TAB DISPLAY CONTENT: APPOINTMENTS CONSULTATION QUEUE */}
                        {activeTab === "appointments" && (
                            <motion.div
                                key="appointments"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight text-white">Active Consultation Queue</h2>
                                        <p className="text-slate-400 text-xs mt-0.5">Approve, clear out, or process operational clinical data fields safely.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchAppointments}
                                        className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold rounded-xl transition-all"
                                    >
                                        Sync Registry
                                    </button>
                                </div>

                                {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">{error}</div>}

                                {appointments.length === 0 ? (
                                    <div className="bg-slate-950 rounded-2xl border border-slate-800 border-dashed p-16 text-center max-w-xl mx-auto mt-6">
                                        <Calendar className="mx-auto text-slate-700 mb-4" size={40} />
                                        <h3 className="font-bold text-slate-300">Consultation queue clear</h3>
                                        <p className="text-slate-500 text-xs mt-1">There are no diagnostic data rows assigned to your profile identifier.</p>
                                    </div>
                                ) : (
                                    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                                        <div className="w-full flex items-center justify-between bg-slate-900/50 border-b border-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider py-4 px-6">
                                            <div className="w-1/12">ID #</div>
                                            <div className="w-4/12">Patient Registry Meta</div>
                                            <div className="w-2/12">Target Date</div>
                                            <div className="w-2/12">Token State</div>
                                            <div className="w-3/12 text-right">Operations Pipeline</div>
                                        </div>

                                        <div className="divide-y divide-slate-800/60">
                                            {appointments.map((app) => (
                                                <div key={`${app.appointmentNumber}-${app.date}`} className="w-full flex items-center justify-between py-4 px-6 hover:bg-slate-900/20 transition-colors text-sm">
                                                    <div className="w-1/12 font-mono font-bold text-slate-500">#{app.appointmentNumber}</div>
                                                    <div className="w-4/12 font-medium text-slate-200 flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                                                        <Mail size={14} className="text-slate-600 flex-shrink-0" /> {app.patientEmail}
                                                    </div>
                                                    <div className="w-2/12 text-slate-400 font-medium">{formatDate(app.date)}</div>
                                                    <div className="w-2/12">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold ${app.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                            app.status === "CANCELED" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                            }`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                    <div className="w-3/12 flex items-center justify-end gap-1.5">
                                                        {app.status !== "CONFIRMED" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleStatusChange(app.appointmentNumber, app.date, "CONFIRMED", app.patientEmail)}
                                                                className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
                                                                title="Authorize & Confirm"
                                                            >
                                                                <CheckCircle size={16} />
                                                            </button>
                                                        )}
                                                        {app.status !== "CANCELED" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleStatusChange(app.appointmentNumber, app.date, "CANCELED", app.patientEmail)}
                                                                className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
                                                                title="Revoke / Cancel"
                                                            >
                                                                <XCircle size={16} />
                                                            </button>
                                                        )}
                                                        <div className="h-4 w-px bg-slate-800 mx-1" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(app.appointmentNumber, app.date)}
                                                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                                                            title="Drop Data Record"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* TAB DISPLAY CONTENT: PROFILE VIEW */}
                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-4xl"
                            >
                                <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative">
                                    <div className="h-32 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-60" />
                                    <div className="p-8 relative pt-14">
                                        <div className="absolute -top-12 left-8 border-4 border-slate-950 shadow-md bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl p-4 w-24 h-24 flex items-center justify-center font-black text-3xl">
                                            {user?.firstName?.substring(0, 2).toUpperCase() || "DR"}
                                        </div>

                                        <div className="space-y-1">
                                            <h2 className="text-3xl font-black text-white">Dr. {user?.firstName} {user?.lastName}</h2>
                                            <p className="text-cyan-400 font-bold text-sm tracking-wider uppercase">{user?.specialization || "Medical Specialist"}</p>
                                        </div>

                                        <div className="mt-8 border-t border-slate-800/60 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex gap-3"><Mail className="text-slate-500 flex-shrink-0" size={18} /><div><p className="text-[10px] font-bold text-slate-500 uppercase">System Key Email</p><p className="text-slate-200 font-medium mt-0.5">{user?.email || "N/A"}</p></div></div>
                                            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex gap-3"><Phone className="text-slate-500 flex-shrink-0" size={18} /><div><p className="text-[10px] font-bold text-slate-500 uppercase">Contact Link</p><p className="text-slate-200 font-medium mt-0.5">{user?.phoneNumber || "N/A"}</p></div></div>
                                            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex gap-3"><Briefcase className="text-slate-500 flex-shrink-0" size={18} /><div><p className="text-[10px] font-bold text-slate-500 uppercase">Seniority Experience</p><p className="text-slate-200 font-medium mt-0.5">{user?.experience ? `${user.experience} Years active practice` : "Not Configured"}</p></div></div>
                                            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex gap-3"><MapPin className="text-slate-500 flex-shrink-0" size={18} /><div><p className="text-[10px] font-bold text-slate-500 uppercase">Assigned Room Unit</p><p className="text-slate-200 font-mono font-bold mt-0.5">{user?.roomNumber || "N/A"}</p></div></div>
                                            
                                            {/* FIXED: Safe Object Property Parsing Layout Loop prevents runtime child component crashes */}
                                            <div className="col-span-1 md:col-span-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-2">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Consultation Schedule Allocation</p>
                                                <div className="flex flex-col gap-2">
                                                    {user?.availability && user.availability.length > 0 ? (
                                                        user.availability.map((shift: Shift, idx: number) => (
                                                            <div key={idx} className="flex items-center gap-3 text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-xl w-fit shadow-inner">
                                                                <span className="font-bold text-cyan-400 uppercase tracking-wide w-24">{shift.day}</span>
                                                                <span className="text-slate-400 font-mono">({shift.startTime} - {shift.endTime})</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-500 italic">No shifts assigned to active consultation slots yet.</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-span-1 md:col-span-2 bg-cyan-950/20 p-4 rounded-xl border border-cyan-900/40 flex justify-between items-center shadow-inner">
                                                <div>
                                                    <p className="text-[10px] font-bold text-cyan-500 uppercase">Live Session Tariff</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">Calculated dynamically using backend multiplier parameters</p>
                                                </div>
                                                <span className="text-xl font-black text-emerald-400">Rs. {calculateAppointmentPrice(user?.specialization || "", user?.experience || 0).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingProfile(true)}
                                                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-cyan-950/30 active:scale-95"
                                            >
                                                Edit Profile Layout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* --- CLINICAL PROFILE EDIT DIALOG MODAL --- */}
            {isEditingProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsEditingProfile(false)} />
                    <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto text-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white">Modify Professional Properties</h2>
                                <p className="text-xs text-slate-400">Update parameters to reshape database entity states maps.</p>
                            </div>
                            <X size={20} className="cursor-pointer text-slate-400 hover:text-white" onClick={() => setIsEditingProfile(false)} />
                        </div>

                        <div className="space-y-5">
                            {formError && <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-400">{formError}</div>}
                            {formStatus && <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-4 text-xs font-semibold text-cyan-400">{formStatus}</div>}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormInputField label="First Name" value={profileForm.firstName} onChange={(val) => handleEditInput('firstName', val)} />
                                <FormInputField label="Last Name" value={profileForm.lastName} onChange={(val) => handleEditInput('lastName', val)} />
                                <FormInputField label="Contact Phone Link" value={profileForm.phoneNumber} onChange={(val) => handleEditInput('phoneNumber', val)} />
                                <FormInputField label="Date of Birth" type="date" value={profileForm.dateOfBirth} onChange={(val) => handleEditInput('dateOfBirth', val)} />
                            </div>

                            <FormInputField label="Seniority Active Experience (Years)" type="number" value={profileForm.experience} onChange={(val) => handleEditInput('experience', val)} placeholder="e.g. 7" />

                            {/* WEEKLY TIMED SHIFTS CONFIGURATION COMPLEX MATRIX */}
                            <div className="space-y-3 text-xs">
                                <label className="text-slate-400 font-bold uppercase tracking-wider">Configure Weekly Consultation Shifts</label>
                                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                                        const targetShift = profileForm.availability.find((s) => s.day === day);
                                        const isChecked = !!targetShift;

                                        return (
                                            <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800/40 hover:border-slate-700/50 transition-colors">
                                                <label className="flex items-center gap-3 cursor-pointer text-slate-300 hover:text-white transition-colors font-semibold sm:w-32">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) => handleDayCheckboxChange(day, e.target.checked)}
                                                        className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-600 focus:ring-cyan-500 outline-none accent-cyan-500"
                                                    />
                                                    <span>{day}</span>
                                                </label>

                                                {isChecked ? (
                                                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-slate-500 text-[10px] uppercase font-bold">From</span>
                                                            <input
                                                                type="time"
                                                                value={targetShift.startTime}
                                                                onChange={(e) => handleTimeChange(day, "startTime", e.target.value)}
                                                                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-medium text-xs outline-none focus:border-cyan-500"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-slate-500 text-[10px] uppercase font-bold">To</span>
                                                            <input
                                                                type="time"
                                                                value={targetShift.endTime}
                                                                onChange={(e) => handleTimeChange(day, "endTime", e.target.value)}
                                                                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-medium text-xs outline-none focus:border-cyan-500"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-600 italic text-[11px]">Unavailable / Off Duty</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-1.5 text-xs">
                                <label className="text-slate-400 font-bold uppercase tracking-wider">Home/Residential Address String</label>
                                <textarea
                                    value={profileForm.address}
                                    onChange={(e) => handleEditInput('address', e.target.value)}
                                    className="w-full min-h-[80px] text-sm bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-cyan-500 text-white resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingProfile(false)}
                                    className="flex-1 py-2.5 bg-slate-800 text-xs font-bold rounded-xl hover:bg-slate-700 transition"
                                >
                                    Abort
                                </button>
                                <button
                                    type="button"
                                    onClick={editProfile}
                                    className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white rounded-xl transition shadow-lg shadow-cyan-900/20"
                                >
                                    Save Modifications
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}

// --- SHARED INTERNAL COMPONENT FORM SUBS ---
function FormInputField({ label, type = "text", value, onChange, placeholder }: { label: string; type?: string; value: string; onChange: (val: string) => void; placeholder?: string }) {
    return (
        <div className="space-y-1.5 text-xs text-left w-full">
            <label className="text-slate-400 font-bold uppercase tracking-wider">{label}</label>
            <input 
                type={type} 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                placeholder={placeholder} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-cyan-500 transition-colors" 
            />
        </div>
    );
}