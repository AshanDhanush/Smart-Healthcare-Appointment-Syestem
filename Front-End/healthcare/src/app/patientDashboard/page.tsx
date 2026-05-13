"use client";

import { useState } from "react";
import { User, Calendar, LogOut, Clock, Activity, HeartPulse, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const SideNav = ({
    logout, currentTab, setCurrentTab
}: {
    logout: () => void;
    currentTab: string;
    setCurrentTab:  React.Dispatch<React.SetStateAction<string>>;
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
    const logout = auth.logout || (() => alert("Logout functionality pending."));

    const [currentTab, setCurrentTab] = useState("Home");
    
    // Mock Data for the smart UI
    const MOCK_USER = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+94 77 123 4567",
        dob: "1990-05-15",
        bloodGroup: "O+",
        address: "123 Main St, Colombo 03, Sri Lanka"
    };

    const MOCK_APPOINTMENTS = [
        {
            id: "APT-001",
            doctorName: "Dr. Aruni Perera",
            specialization: "Cardiology",
            date: "2026-05-15",
            time: "10:00 AM",
            status: "Upcoming",
            room: "A-201"
        },
        {
            id: "APT-002",
            doctorName: "Dr. Sunil Perera",
            specialization: "Surgery",
            date: "2026-04-20",
            time: "02:30 PM",
            status: "Completed",
            room: "D-101"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar/>
            <div className="flex flex-col md:flex-row flex-1 pt-24 md:pt-28">
                <SideNav logout={logout} currentTab={currentTab} setCurrentTab={setCurrentTab} />
                
                <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30">
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
                        {MOCK_USER.name.charAt(0)}
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
                                <p className="text-2xl font-extrabold text-slate-800">1 Appointment</p>
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
                            {MOCK_APPOINTMENTS.map((apt) => (
                                <div key={apt.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                                    <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${apt.status === "Upcoming" ? "bg-blue-500 group-hover:bg-blue-600" : "bg-emerald-500 group-hover:bg-emerald-600"}`} />
                                    
                                    <div className="flex justify-between items-start mb-5 pl-2">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{apt.id}</p>
                                            <h3 className="text-xl font-extrabold text-slate-800">{apt.doctorName}</h3>
                                            <p className="text-blue-600 font-semibold text-sm">{apt.specialization}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                                            apt.status === "Upcoming" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3 mt-6 bg-slate-50 p-5 rounded-xl text-sm font-medium text-slate-600 ml-2">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            <span>{apt.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-indigo-500" />
                                            <span>{apt.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-4 h-4 text-rose-500" />
                                            <span>Room {apt.room}</span>
                                        </div>
                                    </div>

                                    {apt.status === "Upcoming" && (
                                        <div className="mt-6 flex gap-3 ml-2">
                                            <button className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-2.5 rounded-xl font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">Reschedule</button>
                                            <button className="flex-1 bg-rose-50 border-2 border-transparent text-rose-600 py-2.5 rounded-xl font-bold hover:bg-rose-100 transition-colors">Cancel</button>
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
                                {MOCK_USER.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{MOCK_USER.name}</h2>
                                <p className="text-slate-500 font-semibold text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-slate-400" />
                                    {MOCK_USER.email}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Number</p>
                                <p className="text-lg font-semibold text-slate-800">{MOCK_USER.phone}</p>
                            </div>
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</p>
                                <p className="text-lg font-semibold text-slate-800">{MOCK_USER.dob}</p>
                            </div>
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Blood Group</p>
                                <p className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <HeartPulse className="w-6 h-6 text-rose-500" />
                                    {MOCK_USER.bloodGroup}
                                </p>
                            </div>
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Address</p>
                                <p className="text-lg font-semibold text-slate-800">{MOCK_USER.address}</p>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end relative z-10">
                            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
        </div>
       
    );
}
