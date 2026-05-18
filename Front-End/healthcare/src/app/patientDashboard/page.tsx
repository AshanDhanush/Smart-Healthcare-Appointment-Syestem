"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { User, Calendar, LogOut, Clock, Activity, HeartPulse, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import axios from "axios";

interface Appointment {
    patientName: string;
    patientEmail: string;
    doctorName: string;
    doctorEmail: string;
    doctorSpecialization: string;
    departmentCode: string;
    roomNumber: string;
    appointmentFees: number;
    date: Date;
    number: number;
    status: "PENDING" | "COMPLETED" | "CONFIRMED";
}

const SideNav = ({
    logout, currentTab, setCurrentTab
}: {
    logout: () => void;
    currentTab: string;
    setCurrentTab: Dispatch<SetStateAction<string>>;
}) => (
    <aside className="w-full md:w-72 bg-white border-r border-slate-200 shadow-sm md:min-h-screen flex flex-col z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 text-blue-600">
            <HeartPulse className="w-8 h-8" />
            <span className="text-2xl font-extrabold text-slate-800 tracking-tight">HealthSync</span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-3">
            <button
                onClick={() => setCurrentTab("Home")}
                className={`w-full px-5 py-3.5 rounded-xl text-left transition-all flex items-center space-x-4 font-semibold ${
                    currentTab === "Home" 
                        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
                <LayoutDashboard className={`w-5 h-5 ${currentTab === "Home" ? "text-blue-600" : "text-slate-400"}`} />
                <span>Home</span>
            </button>

            <button
               onClick={() => setCurrentTab("Appointments")}
                className={`w-full px-5 py-3.5 rounded-xl text-left transition-all flex items-center space-x-4 font-semibold ${
                    currentTab === "Appointments" 
                        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
                <Calendar className={`w-5 h-5 ${currentTab === "Appointments" ? "text-blue-600" : "text-slate-400"}`} />
                <span>Appointments</span>
            </button>

            <button
                onClick={() => setCurrentTab("Profile")}
                className={`w-full px-5 py-3.5 rounded-xl text-left transition-all flex items-center space-x-4 font-semibold ${
                    currentTab === "Profile" 
                        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
                <User className={`w-5 h-5 ${currentTab === "Profile" ? "text-blue-600" : "text-slate-400"}`} />
                <span>Profile</span>
            </button>
        </nav>   

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 text-rose-600 bg-white border border-rose-100 hover:bg-rose-50 hover:border-rose-200 rounded-xl transition-all font-semibold shadow-sm"
            >
                <LogOut className="w-5 h-5" />
                Log Out
            </button>
        </div>
    </aside>
)

export default function PatientDashboardPage() {
    const auth = useAuth() || {};
    const { user, updateUser } = auth;
    const logout = auth.logout || (() => alert("Logout functionality pending."));

    const [currentTab, setCurrentTab] = useState("Home");
    const [loading , setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [cancle,setCancle] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || "",
        dateOfBirth: user?.dateOfBirth || "",
        gender: user?.gender || "",
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [formStatus, setFormStatus] = useState<string | null>(null);

    useEffect(() => {
    // If the user's email isn't loaded yet, do not trigger the API call
    if (!user?.email) return;

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/api/appointments/get/patient?patientEmail=${encodeURIComponent(user.email)}`,
                { withCredentials: true }
            );
            setAppointments(response.data);
        } catch (err) {
            setError("Failed to load appointments. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    fetchAppointments();
}, [user?.email, cancle]);

    useEffect(() => {
        setProfileForm({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phoneNumber: user?.phoneNumber || "",
            address: user?.address || "",
            dateOfBirth: user?.dateOfBirth || "",
            gender: user?.gender || "",
        
        });
    }, [user]);

    const handleEditInput = (field: string, value: string) => {
        setProfileForm((prev) => ({ ...prev, [field]: value }));
    };

    const deleteAppointment = async (appointmentNumber: number , date: Date) => {
        setLoading(true);
        setError(null);
        try {
           await axios.delete(
    `http://localhost:8080/api/appointments/delete?appointmentNumber=${appointmentNumber}&date=${date.toISOString().split('T')[0]}`,
    { withCredentials: true }
);
            setError(null);
            setCancle(prev => !prev); // Trigger refetch after successful deletion

        } catch (err) {
            setError("Failed to cancel appointment. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const editProfile = async () => {
        setFormError(null);
        setFormStatus(null);
        setLoading(true);

        try {
            const response = await axios.put(`http://localhost:8080/api/auth/update/profile?email=${user?.email}`, {
                firstName: profileForm.firstName,
                lastName: profileForm.lastName,
                dateOfBirth: profileForm.dateOfBirth || null,
                gender: profileForm.gender || null,
                phoneNumber: profileForm.phoneNumber,
                address: profileForm.address || null,
            }); 
            
            const updatedUser = { ...user, ...profileForm };
            if (typeof updateUser === "function") {
                updateUser(updatedUser);
            }

            setFormStatus('Profile updated successfully.');
            setProfileForm((prev) => ({ ...prev, ...updatedUser }));
            setIsEditingProfile(false);
        } catch (err) {
            setFormError('Profile update failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }   

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar/>
            <div className="flex flex-col md:flex-row flex-1 pt-24 md:pt-28">
                <SideNav logout={logout} currentTab={currentTab} setCurrentTab={setCurrentTab} />
                
                <main className={`flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30 transition-opacity ${isEditingProfile ? 'opacity-40' : 'opacity-100'}`}>
                {/* Header */}
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                            {currentTab === "Home" && "Welcome Back, John!"}
                            {currentTab === "Appointments" && "My Appointments"}
                            {currentTab === "Profile" && "Patient Profile"}
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg font-medium">
                            {currentTab === "Home" && "Here is an overview of your health dashboard."}
                            {currentTab === "Appointments" && "Manage your upcoming and past bookings."}
                            {currentTab === "Profile" && "View and manage your personal information."}
                        </p>
                    </div>
                    
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl shadow-sm border border-blue-200">
                        {user?.firstName?.charAt(0) ?? ""}
                    </div>
                </header>

                {/* Tab Contents */}
                {currentTab === "Home" && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase">Upcoming</p>
                                <p className="text-2xl font-extrabold text-slate-800">{appointments.filter((apt) => apt.status === "PENDING").length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Activity className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase">Status</p>
                                <p className="text-2xl font-extrabold text-slate-800">Healthy</p>
                            </div>
                        </div>
                    </div>
                )}

                {currentTab === "Appointments" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <Clock className="w-6 h-6 text-blue-500" />
                            Appointments History
                        </h2>
                        
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {appointments.map((apt) => (
                                <div key={apt.number} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                                    <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${apt.status === "PENDING" ? "bg-blue-500 group-hover:bg-blue-600" : "bg-emerald-500 group-hover:bg-emerald-600"}`} />
                                    
                                    <div className="flex justify-between items-start mb-5 pl-2">
                                        <div>
                                            <p className="inline-block bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-md mb-2 shadow-sm border border-blue-200">
                                                Appointment #{apt.number}
                                            </p>
                                            <h3 className="text-xl font-extrabold text-slate-800">{apt.doctorName}</h3>
                                            <p className="text-blue-600 font-semibold text-sm">{apt.doctorSpecialization}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                                            apt.status === "PENDING" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3 mt-6 bg-slate-50 p-5 rounded-xl text-sm font-medium text-slate-600 ml-2">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            <span>{new Date(apt.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-indigo-500" />
                                            <span>Token No: {apt.number}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-4 h-4 text-rose-500" />
                                            <span>Room {apt.roomNumber}</span>
                                        </div>
                                    </div>

                                    {apt.status === "PENDING" && (
                                        <div className="mt-6 flex gap-3 ml-2">
                                            <button className="flex-1 bg-rose-50 border-2 border-transparent text-rose-600 py-2.5 rounded-xl font-bold hover:bg-rose-100 transition-colors"
                                                onClick={() => {
                                                    deleteAppointment(apt.number, new Date(apt.date));
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentTab === "Profile" && (
                    <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8 md:p-12 max-w-4xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mt-20 -mr-20 pointer-events-none" />
                        
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10 pb-10 border-b border-slate-100 relative z-10">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-5xl shadow-inner border-4 border-white ring-4 ring-slate-50">
                                {user?.firstName?.charAt(0) ?? ""}
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{user?.firstName} {user?.lastName}</h2>
                                <p className="text-slate-500 font-semibold text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-slate-400" />
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Number</p>
                                <p className="text-lg font-semibold text-slate-800">{user?.phoneNumber}</p>
                            </div>
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</p>
                                <p className="text-lg font-semibold text-slate-800">{user?.dateOfBirth}</p>
                            </div>
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Address</p>
                                <p className="text-lg font-semibold text-slate-800">{user?.address}</p>
                            </div>
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</p>
                                <p className="text-lg font-semibold text-slate-800">{user?.gender}</p>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end relative z-10">
                            <button className="bg-gradient-to-r from-cyan-500 to-sky-400 border-2 border-blue-700 text-slate-700 py-3.5 px-8 rounded-xl font-bold hover:border-slate-900 hover:bg-gradient-to-r from-cyan-500 to-sky-600 transition-colors shadow-sm mr-4">
                                Change Password
                            </button>
                            <button
                                onClick={() => setIsEditingProfile(true)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
        {isEditingProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
                            <p className="text-sm text-slate-500">Update your personal details below.</p>
                        </div>
                        <button
                            onClick={() => setIsEditingProfile(false)}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        {formError && <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 text-rose-700">{formError}</div>}
                        {formStatus && <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-700">{formStatus}</div>}
                        <div className="grid gap-6 md:grid-cols-2">
                            <label className="space-y-2 text-sm text-slate-700">
                                <span>First Name</span>
                                <input
                                    value={profileForm.firstName}
                                    onChange={(e) => handleEditInput('firstName', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                            <label className="space-y-2 text-sm text-slate-700">
                                <span>Last Name</span>
                                <input
                                    value={profileForm.lastName}
                                    onChange={(e) => handleEditInput('lastName', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <label className="space-y-2 text-sm text-slate-700">
                                <span>Phone Number</span>
                                <input
                                    value={profileForm.phoneNumber}
                                    onChange={(e) => handleEditInput('phoneNumber', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                            <label className="space-y-2 text-sm text-slate-700">
                                <span>Date of Birth</span>
                                <input
                                    type="date"
                                    value={profileForm.dateOfBirth}
                                    onChange={(e) => handleEditInput('dateOfBirth', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                            <label className="space-y-2 text-sm text-slate-700">
                                <span>Gender</span>
                                <select
                                    value={profileForm.gender}
                                    onChange={(e) => handleEditInput('gender', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </label>
                        </div>
                        <label className="space-y-2 text-sm text-slate-700">
                            <span>Address</span>
                            <textarea
                                value={profileForm.address}
                                onChange={(e) => handleEditInput('address', e.target.value)}
                                className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() => setIsEditingProfile(false)}
                                className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editProfile}
                                className="w-full sm:w-auto rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}
