"use client";

import React from "react";
import axios from "axios";
import { User, Calendar, LogOut, Clock, Activity, HeartPulse, LayoutDashboard, Bell, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRouter";
import { address } from "framer-motion/client";
import AppointmentTrendsCard from "@/components/AppointmentTrendsCard";

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
interface Patients {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    dateOfBirth?: string;
    gender: Gender;
    phoneNumber: string;
    address: string;
    role: Role;
}

interface Appoinmtents {
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




const SideNav = ({
    logout,
    currentTab,
    setCurrentTab,
    isOpen,
    setIsOpen,
    fetchDoctors,
}: {
    logout: () => void;
    currentTab: string;
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchDoctors: () => void;
}) => {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 z-30 md:hidden ${isOpen ? "block" : "hidden"}`}
                onClick={() => setIsOpen(false)}
            />
            <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-800 border-r border-slate-700 p-4 md:p-6 lg:p-8 rounded-r-xl shadow-sm md:static md:translate-x-0 md:block md:w-72 md:min-h-screen transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <div className="flex flex-col items-center gap-6">
                            <HeartPulse size={68} className="text-cyan-600" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-300 bg-clip-text text-transparent">Admin Dashboard</h1>
                        </div>
                    </Link>
                    <button className="md:hidden text-slate-300 hover:text-white" onClick={() => setIsOpen(false)} aria-label="Close menu">
                        <X size={24} />
                    </button>
                </div>
                <div className="border-t-4 border-slate-700 mt-10 "></div>

                <nav className="mt-10 w-full flex flex-col px-4 py-4 gap-4">
                    <button className={`flex items-center gap-3 p-3 rounded-lg text-slate-300 ${currentTab === "dashboard" ? "bg-cyan-600 shadow-sm ring-1 ring-blue-100 text-white" : "hover:bg-slate-700"}`} onClick={() => { setCurrentTab("dashboard"); setIsOpen(false); }}>

                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button className={`flex items-center gap-3 p-3 rounded-lg text-slate-300 ${currentTab === "appointments" ? "bg-cyan-600 text-white" : "hover:bg-slate-700"}`} onClick={() => { setCurrentTab("appointments"); setIsOpen(false); }}>
                        <Calendar size={20} />
                        <span>Appointments</span>
                    </button>
                    <button className={`flex items-center gap-3 p-3 rounded-lg text-slate-300 ${currentTab === "patients" ? "bg-cyan-600 text-white" : "hover:bg-slate-700"}`} onClick={() => { setCurrentTab("patients"); setIsOpen(false); }}>
                        <User size={20} />
                        <span>Patients</span>
                    </button>
                    <button
                        className={`flex items-center gap-3 p-3 rounded-lg text-slate-300 ${currentTab === "doctors" ? "bg-cyan-600 text-white" : "hover:bg-slate-700"}`}
                        onClick={() => { setCurrentTab("doctors"); setIsOpen(false); fetchDoctors(); }}
                    >
                        <User size={20} />
                        <span>Doctors</span>
                    </button>
                    <button className={`flex items-center gap-3 p-3 rounded-lg text-slate-300 ${currentTab === "profile" ? "bg-cyan-600 text-white" : "hover:bg-slate-700"}`} onClick={() => { setCurrentTab("profile"); setIsOpen(false); }}>
                        <Activity size={20} />
                        <span>Profile</span>
                    </button>

                </nav>

                <div className="p-6 border-t border-slate-700 mt-10">
                    <button
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 text-rose-600 border hover:bg-rose-50 hover:border-rose-200 rounded-xl transition-all font-semibold shadow-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </div>
            </aside>
        </>
    );
}





export default function AdminDashboardPage() {
    const auth = useAuth() || {};
    const { logout, user, updateUser } = auth;
    const [currentTab, setCurrentTab] = React.useState("dashboard");
    const [loading, setLoading] = React.useState(false);
    const [patientCount, setPatientCount] = React.useState<number>(0);
    const [appointmentCount, setAppointmentCount] = React.useState<number>(0);
    const [doctorCount, setDoctorCount] = React.useState<number>(0);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [doctors, setDoctors] = React.useState<Doctors[]>([]);
    const [patients, setPatients] = React.useState<Patients[]>([]);
    const [appointments ,setAppointments] = React.useState<Appoinmtents[]>([]);
    const [errors, setErrors] = React.useState<string>("");
    const [isAddDoctorModelOpen, setIsAddDoctorModelOpen] = React.useState(false);
    const [isAddPatientModelOpen, setIsAddPatientModelOpen] = React.useState(false);
    const [patientFormData, setPatientFormData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        address: "",
        dateOfBirth: "",
        gender: "MALE" as Gender,
    });
    const [doctorFormData, setDoctorFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        roomNumber: '',
        phoneNumber: '',
        address: '',
        specialization: 'Cardiology', // Default value
        departmentCode: 'CARD', // Default value
        role: 'DOCTOR',
        gender: 'MALE' // Default value
    });

    const [doctorViewData, setDoctorViewData] = React.useState(false);
    const [selectedDoctor, setSelectedDoctor] = React.useState<Doctors | null>(null);

    const [patientViewData, setPatientViewData] = React.useState(false);
    const [selectedPatient, setSelectedPatient] = React.useState<Patients | null>(null);

    const [isEditingProfile, setIsEditingProfile] = React.useState(false);
    const [profileForm, setProfileForm] = React.useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || "",
        dateOfBirth: user?.dateOfBirth || "",
        gender: user?.gender || "",
    });
    const [formError, setFormError] = React.useState<string | null>(null);
    const [formStatus, setFormStatus] = React.useState<string | null>(null);

   


    React.useEffect(() => {
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
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            const updatedUser = { ...user, ...profileForm };
            if (typeof updateUser === "function") {
                updateUser(updatedUser);
            }

            setFormStatus('Profile updated successfully.');
            setProfileForm((prev) => ({ ...prev, ...updatedUser }));
            setIsEditingProfile(false);
        } catch (err: any) {
            setFormError('Profile update failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = React.useCallback(async () => {
        setLoading(true);
        setErrors("");
        try {
            const response = await axios.get("http://localhost:8080/api/auth/admin/get/doctors", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setErrors("Failed to load doctor list. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPatients = React.useCallback(async () => {
        setLoading(true);
        setErrors("");
        try {
            const response = await axios.get("http://localhost:8080/api/auth/admin/get/patients", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
            setErrors("Failed to load patient list. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);
    const fetchAppointments = React.useCallback(async () => {
        setLoading(true);
        setErrors("");
        try {
            const response = await axios.get("http://localhost:8080/api/appointments/get/all", { withCredentials: true });
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setErrors("Failed to load appointment list. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        let isMounted = true;

        const fetchDashboardCounts = async () => {
            setLoading(true);
            setErrors("");

            try {
                const response = await axios.get("http://localhost:8080/api/auth/admin/stats", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                const response1 = await axios.get("http://localhost:8080/api/appointments/get/appointment/amount", { withCredentials: true });
                const { patients, doctors } = response.data;
                const total_amount = response1.data;

                if (!isMounted) return;

                setPatientCount(typeof patients === "number" ? patients : 0);
                setAppointmentCount(typeof total_amount === "number" ? total_amount : parseInt(total_amount) || 0);
                setDoctorCount(typeof doctors === "number" ? doctors : 0);
            } catch (error) {
                console.error("Failed to fetch dashboard counts:", error);
                setErrors("Failed to load dashboard information.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (currentTab === "dashboard") {
            fetchDashboardCounts();
        } else if (currentTab === "doctors") {
            fetchDoctors();
        } else if (currentTab === "patients") {
            fetchPatients();
        } else if (currentTab === "appointments") {
            fetchAppointments();
        }

        return () => {
            isMounted = false;
        };
    }, [currentTab, fetchDoctors, fetchPatients, fetchAppointments]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setDoctorFormData({ ...doctorFormData, [e.target.name]: e.target.value });
    };



    const handleDoctorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors("");


        if (doctorFormData.password !== doctorFormData.confirmPassword) {
            setErrors("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {

            const response = await axios.post("http://localhost:8080/api/auth/register", {
                firstName: doctorFormData.firstName,
                lastName: doctorFormData.lastName,
                email: doctorFormData.email,
                password: doctorFormData.password,
                role: Role.DOCTOR,
                phoneNumber: doctorFormData.phoneNumber,
                address: doctorFormData.address,
                specialization: doctorFormData.specialization,
                departmentCode: doctorFormData.departmentCode,
                roomNumber: doctorFormData.roomNumber,
                gender: doctorFormData.gender
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (response.status === 200 || response.status === 201) {
                alert("Doctor registered successfully!");
                setIsAddDoctorModelOpen(false); // Close the modal
                fetchDoctors(); // Refresh the table list automatically
            }
        } catch (error: any) {
            console.error("Registration error:", error);
            setErrors(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPatientFormData({ ...patientFormData, [e.target.name]: e.target.value });
    };

    const handlePatientSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors("");

        if (patientFormData.password !== patientFormData.confirmPassword) {
            setErrors("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/auth/register", {
                firstName: patientFormData.firstName,
                lastName: patientFormData.lastName,
                email: patientFormData.email,
                password: patientFormData.password,
                role: Role.PATIENT,
                phoneNumber: patientFormData.phoneNumber,
                address: patientFormData.address,
                dateOfBirth: patientFormData.dateOfBirth || null,
                gender: patientFormData.gender || null
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (response.status === 200 || response.status === 201) {
                alert("Patient registered successfully!");
                setIsAddPatientModelOpen(false); // Close the modal
                fetchPatients(); // Refresh the table list automatically
            }
        } catch (error: any) {
            console.error("Registration error:", error);
            setErrors(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (email: string) => {
        if (!confirm("Are you sure you want to delete this doctor? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8080/api/auth/admin/delete/user/${email}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.status === 200) {
                setDoctorViewData(false);
                fetchDoctors();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            setErrors("Failed to delete user. Please try again.");
        }
    };

    const deleteAppointment = async (appointmentNumber: number, dateStr: string | Date, doctorEmail: string) => {
    if (!confirm("Are you sure you want to permanently delete this appointment record?")) return;
    
    setLoading(true);
    setErrors("");
    try {
        // Convert date safely to YYYY-MM-DD format without zone shifting issues
        const formattedDate = new Date(dateStr).toISOString().split('T')[0];
        
        // Target port 8084 directly where the appointment microservice processes deletions
        const res = await axios.delete(`http://localhost:8080/api/appointments/delete`, {
            data: {
                doctorEmail,
                date: formattedDate,
                appointmentNumber // Transmits field with the correct variable signature
            },
            withCredentials: true
        });

        // Handle fallback responses gracefully based on your backend response entities
        if (res.data === false) {
            throw new Error("Appointment not found or could not be verified for deletion.");
        }
        
        alert("Appointment successfully canceled and removed.");
        fetchAppointments(); // Re-trigger tracking fetch to update UI state table
    } catch (err: any) {
        console.error("Deletion execution failure:", err);
        setErrors(err.response?.data?.message || err.message || "Failed to cancel appointment. Please try again later.");
    } finally {
        setLoading(false);
    }
};

    const handleStatusChange = async (appointmentNumber: number, date: Date, status: string, patientEmail: string, doctorEmail: string) => {
        setLoading(true);
        setErrors("");
        try {
            const res = await axios.put(
                `http://localhost:8080/api/appointments/update/status`,
                {
                    patientEmail,
                    doctorEmail,
                    status,
                    appointmentNumber,
                    date: date.toISOString().split('T')[0]
                },
                {
                    withCredentials: true
                }
            );
            if (res.data === false) {
                throw new Error("Appointment not found or status could not be updated.");
            }
            fetchAppointments();  
        } catch (err: any) {
            setErrors(err.response?.data || err.message || "Failed to update appointment status. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col md:flex-row bg-slate-700 min-h-screen ">
                <SideNav logout={logout} currentTab={currentTab} setCurrentTab={setCurrentTab} isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} fetchDoctors={fetchDoctors} />
                <main className="flex-1 ">
                    <header className="p-4 flex flex-row items-center border-b border-slate-700 bg-sky-500">
                        <button className="md:hidden text-white p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 mr-3" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
                            <Menu size={24} />
                        </button>
                        <HeartPulse size={40} className="text-white ml-4" />
                        <h1 className="text-2xl px-4 font-bold text-slate-100 capitalize flex-1 text-center">{currentTab}</h1>
                        <Bell size={20} className="text-black mt-0 ml-auto" />
                        <div className="ml-4 flex flex-row items-center hover:bg-slate-300 rounded-lg px-3 py-2 transition cursor-pointer">
                            <User className="text-black " />
                            <span className="text-slate-100 ml-2">{`${user.firstName} ${user.lastName}}`}</span>
                        </div>
                    </header>
                    {currentTab === "dashboard" && (
                        <div className="p-6">
                            <div className="flex flex-col items-center gap-4 ">
                                <h1 className="text-2xl font-semibold text-slate-100 mb-4">Welcome to the Admin Dashboard {user?.name}</h1>
                                <p className="text-slate-300">Here you can manage appointments, patients, doctors, and your profile.</p>
                                {errors && <p className="text-red-500 mt-2">{errors}</p>}
                            </div>
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                                <div className="bg-slate-300 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <Clock size={24} className="text-cyan-600 mb-2" />
                                        <h2 className="text-lg font-semibold text-slate-900 mb-2">Total Appointments</h2>

                                    </div>

                                    <p className="text-3xl font-bold text-cyan-600">{loading ? "..." : appointmentCount}</p>
                                </div>
                                <div className="bg-slate-300 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <User size={24} className="text-cyan-600 mb-2" />
                                        <h2 className="text-lg font-semibold text-slate-900 mb-2">Total Patients</h2>
                                    </div>
                                    <p className="text-3xl font-bold text-cyan-600">{loading ? "..." : patientCount}</p>
                                </div>
                                <div className="bg-slate-300 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <User size={24} className="text-cyan-600 mb-2" />
                                        <h2 className="text-lg font-semibold text-slate-900 mb-2">Total Doctors</h2>
                                    </div>
                                    <p className="text-3xl font-bold text-cyan-600">{loading ? "..." : doctorCount}</p>
                                </div>

                            </div>

                            <div className="mt-6">
                                <AppointmentTrendsCard />
                            </div>
                        </div>
                    )}
                    {currentTab === "appointments" && (
                        <div className="p-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-100">Appointments List</h2>
                                <p className="text-slate-400 text-sm">Total: {appointments.length} Appointments</p>

                            </div>

                            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-900/50 border-b border-slate-700">
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Patient Name</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Patient Email</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Doctor Name</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Doctor Email</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Doctor Specialization</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Department Code</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Room Number</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Appointment Fees</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Date</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Appointment Number</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Status</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={12} className="p-10 text-center text-slate-400">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                                            Fetching Appointments data...
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : appointments.length > 0 ? (
                                                appointments.map((a, index) => (
                                                    <tr key={index} className="hover:bg-slate-700/30 transition-colors group">
                                                        <td className="p-4">
                                                            <div className="font-medium text-slate-100">{a.patientName}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded text-xs border border-cyan-800">
                                                                {a.patientEmail}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-slate-200">{a.doctorName}</div>
                                                        </td>
                                                        <td className="p-4 text-slate-300">
                                                            <div className="text-slate-200">{a.doctorEmail}</div>
                                                        </td>
                                                        <td className="p-4 text-slate-300 font-mono text-sm">
                                                            {a.doctorSpecialization}
                                                        </td>
                                                        <td className="p-4 text-slate-300 font-mono text-sm">
                                                            {a.departmentCode}
                                                        </td>
                                                        <td className="p-4 text-slate-300 font-mono text-sm">
                                                            {a.roomNumber}
                                                        </td>
                                                        <td className="p-4 text-slate-300 text-sm font-semibold text-emerald-400">
                                                            LKR {a.appointmentFees}
                                                        </td>
                                                        <td className="p-4 text-slate-300 text-sm">
                                                            {new Date(a.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-4 text-slate-300 font-mono text-sm font-bold text-center">
                                                            {a.number}
                                                        </td>
                                                        <td className="p-4 text-slate-300 text-sm">
                                                            <select
                                                                value={a.status}
                                                                onChange={(e) => handleStatusChange(a.number, new Date(a.date), e.target.value, a.patientEmail, a.doctorEmail)}
                                                                className={`px-2 py-1 rounded text-xs font-bold outline-none border border-slate-600 cursor-pointer ${
                                                                    a.status === 'PENDING' ? 'bg-amber-500/20 text-amber-500' :
                                                                    a.status === 'CONFIRMED' ? 'bg-sky-500/20 text-sky-500' :
                                                                    'bg-emerald-500/20 text-emerald-500'
                                                                }`}
                                                            >
                                                                <option value="PENDING" className="bg-slate-800 text-amber-500">PENDING</option>
                                                                <option value="CONFIRMED" className="bg-slate-800 text-sky-500">CONFIRMED</option>
                                                                <option value="COMPLETED" className="bg-slate-800 text-emerald-500">COMPLETED</option>
                                                            </select>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => {
                                                                  deleteAppointment(a.number, a.date, a.doctorEmail);
                                                                }}
                                                                className="px-4 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-bold rounded-lg transition-all border border-rose-500/30"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={12} className="p-10 text-center text-slate-500 italic">
                                                        No appointments found in the system.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentTab === "patients" && (
                        <div className="p-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-100">Patients List</h2>
                                <p className="text-slate-400 text-sm">Total: {patients.length} Patients</p>
                                <button className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold rounded-lg transition-all duration-200 active:scale-95 shadow-lg shadow-sky-500/20 flex items-center gap-2"
                                    onClick={() => setIsAddPatientModelOpen(true)}
                                >
                                    <User size={18} />
                                    Add Patients
                                </button>

                            </div>

                            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-900/50 border-b border-slate-700">
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Full Name</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Email</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Phone Number</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Address</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Gender</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Date of Birth</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Role</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={6} className="p-10 text-center text-slate-400">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                                            Fetching pateint data...
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : patients.length > 0 ? (
                                                patients.map((pateint, index) => (
                                                    <tr key={index} className="hover:bg-slate-700/30 transition-colors group">
                                                        <td className="p-4">
                                                            <div className="font-medium text-slate-100">{`${pateint.firstName} ${pateint.lastName}`}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded text-xs border border-cyan-800">
                                                                {pateint.email}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-slate-200">{pateint.phoneNumber}</div>
                                                        </td>
                                                        <td className="p-4 text-slate-300">
                                                            <div className="text-slate-200">{pateint.address}</div>
                                                        </td>
                                                        <td className="p-4 text-slate-300 font-mono text-sm">
                                                            {pateint.gender}
                                                        </td>
                                                        <td className="p-4 text-slate-300 text-sm">
                                                            {pateint.dateOfBirth || "N/A"}
                                                        </td>
                                                        <td className="p-4 text-slate-300 font-semibold text-sm text-sky-400">
                                                            {pateint.role}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => {
                                                                    setPatientViewData(true);
                                                                    setSelectedPatient(pateint);
                                                                }}
                                                                className="px-4 py-1.5 bg-slate-700 hover:bg-cyan-600 text-white text-xs font-semibold rounded-lg transition-all"
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="p-10 text-center text-slate-500 italic">
                                                        No patients found in the system.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentTab === "doctors" && (
                        <div className="p-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-100">Manage Doctors</h2>
                                <p className="text-slate-400 text-sm">Total: {doctors.length} Doctors</p>
                                <button className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold rounded-lg transition-all duration-200 active:scale-95 shadow-lg shadow-sky-500/20 flex items-center gap-2"
                                    onClick={() => setIsAddDoctorModelOpen(true)}
                                >
                                    <User size={18} />
                                    Add Doctors
                                </button>

                            </div>

                            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-900/50 border-b border-slate-700">
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Full Name</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Specialization</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Department</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Availability</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm">Room</th>
                                                <th className="p-4 text-slate-300 font-semibold text-sm text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={6} className="p-10 text-center text-slate-400">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                                            Fetching doctor data...
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : doctors.length > 0 ? (
                                                doctors.map((doc, index) => (
                                                    <tr key={index} className="hover:bg-slate-700/30 transition-colors group">
                                                        <td className="p-4">
                                                            <div className="font-medium text-slate-100">{`${doc.firstName} ${doc.lastName}`}</div>
                                                            <div className="text-xs text-slate-400">{doc.email}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded text-xs border border-cyan-800">
                                                                {doc.specialization}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-slate-200">{doc.departmentCode}</div>
                                                        </td>
                                                        <td className="p-4 text-slate-300">
                                                            <div className="flex flex-wrap gap-1">
                                                                {doc.availability?.map((day, dIdx) => (
                                                                    <span key={dIdx} className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-600">
                                                                        {day}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-slate-300 font-mono text-sm">
                                                            {doc.roomNumber}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => {
                                                                    setDoctorViewData(true);
                                                                    setSelectedDoctor(doc);
                                                                }}
                                                                className="px-4 py-1.5 bg-slate-700 hover:bg-cyan-600 text-white text-xs font-semibold rounded-lg transition-all"
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="p-10 text-center text-slate-500 italic">
                                                        No doctors found in the system.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}


                    {currentTab === "profile" && (
                        <div className="p-6">
                            <div className="bg-slate-800 rounded-3xl shadow-lg border border-slate-700 p-8 md:p-12 max-w-4xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-900/30 to-transparent rounded-full -mt-20 -mr-20 pointer-events-none" />

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10 pb-10 border-b border-slate-700 relative z-10">
                                    <div className="w-32 h-32 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-5xl shadow-inner border-4 border-slate-700 ring-4 ring-slate-800">
                                        {user?.firstName?.charAt(0) ?? ""}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-extrabold text-white mb-2">{user?.firstName} {user?.lastName}</h2>
                                        <p className="text-slate-400 font-semibold text-lg flex items-center gap-2">
                                            <User className="w-5 h-5 text-slate-500" />
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:bg-slate-700/50 hover:shadow-md transition-all">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Number</p>
                                        <p className="text-lg font-semibold text-slate-200">{user?.phoneNumber}</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:bg-slate-700/50 hover:shadow-md transition-all">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date of Birth</p>
                                        <p className="text-lg font-semibold text-slate-200">{user?.dateOfBirth}</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:bg-slate-700/50 hover:shadow-md transition-all">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Address</p>
                                        <p className="text-lg font-semibold text-slate-200">{user?.address}</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:bg-slate-700/50 hover:shadow-md transition-all">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</p>
                                        <p className="text-lg font-semibold text-slate-200">{user?.gender}</p>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-slate-700 flex justify-end relative z-10">
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/30 active:scale-95"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
                {/* Add Patient Modal */}
            {isAddPatientModelOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsAddPatientModelOpen(false)}
                    />
                    <div className="relative bg-slate-800 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">Add New Patient</h2>
                                <p className="text-slate-400 text-xs">Enter patient details below to register</p>
                            </div>
                            <button
                                onClick={() => setIsAddPatientModelOpen(false)}
                                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handlePatientSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={patientFormData.firstName}
                                    onChange={handlePatientInputChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-sky-500 outline-none"
                                    placeholder="First Name"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={patientFormData.lastName}
                                    onChange={handlePatientInputChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-sky-500 outline-none"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={patientFormData.email}
                                    onChange={handlePatientInputChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-sky-500 outline-none"
                                    placeholder="patient@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={patientFormData.phoneNumber}
                                    onChange={handlePatientInputChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-sky-500 outline-none"
                                    placeholder="+1 234 567 890"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={patientFormData.dateOfBirth}
                                    onChange={handlePatientInputChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-sky-500 outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={patientFormData.password}
                                    onChange={handlePatientInputChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-sky-500 outline-none"
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={patientFormData.confirmPassword}
                                    onChange={handlePatientInputChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-sky-500 outline-none"
                                    placeholder="Re-Enter Password"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Gender</label>
                                <select
                                    name="gender"
                                    value={patientFormData.gender}
                                    onChange={handlePatientInputChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-sky-500 outline-none"
                                >
                                    <option value="MALE">MALE</option>
                                    <option value="FEMALE">FEMALE</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={patientFormData.address}
                                    onChange={handlePatientInputChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-sky-500 outline-none"
                                    placeholder="123 Main St"
                                />
                            </div>

                            {errors && (
                                <div className="md:col-span-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs font-semibold text-center">
                                    {errors}
                                </div>
                            )}
                            <div className="md:col-span-2 flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddPatientModelOpen(false)}
                                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-900/20 disabled:opacity-50"
                                >
                                    {loading ? "Registering..." : "Add Patient"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Doctor Modal */}
            {isAddDoctorModelOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* The "Background Opacity" layer */}
                        <div
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsAddDoctorModelOpen(false)}
                        />

                        {/* The Form Container */}
                        <div className="relative bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">Register New Doctor</h2>
                                <button
                                    onClick={() => setIsAddDoctorModelOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>



                            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleDoctorSubmit}>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={doctorFormData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        placeholder="John"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={doctorFormData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={doctorFormData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        placeholder="doctor@healthsync.lk"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={doctorFormData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        placeholder="e.g. +1 234 567 8901"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={doctorFormData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        placeholder="Enter Doctor Password"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={doctorFormData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        placeholder="Re-Enter Doctor Password"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Specialization</label>
                                    <select
                                        name="specialization"
                                        value={doctorFormData.specialization}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                    >
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="General Surgery">General Surgery</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Department</label>
                                    <select
                                        name="departmentCode"
                                        value={doctorFormData.departmentCode}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                    >
                                        <option value="CARD">CARD</option>
                                        <option value="NEUR">NEUR</option>
                                        <option value="PEDS">PEDS</option>
                                        <option value="ORTH">ORTH</option>
                                        <option value="SERG">SERG</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Gender</label>
                                    <select
                                        name="gender"
                                        value={doctorFormData.gender}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                    >
                                        <option value="MALE">MALE</option>
                                        <option value="FEMALE">FEMALE</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Room Number</label>
                                    <input
                                        type="text"
                                        name="roomNumber"
                                        value={doctorFormData.roomNumber}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        placeholder="e.g., CARD-B1-R10"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={doctorFormData.address}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        placeholder="123 Main St, Springfield"
                                        required
                                    />
                                </div>

                                {errors && (
                                    <div className="md:col-span-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs font-semibold text-center">
                                        {errors}
                                    </div>
                                )}
                                <div className="md:col-span-2 flex gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddDoctorModelOpen(false)}
                                        className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-900/20 disabled:opacity-50"
                                    >
                                        {loading ? "Registering..." : "Register Doctor"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Doctor View Modal */}
                {doctorViewData && selectedDoctor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Background Overlay */}
                        <div
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                            onClick={() => setDoctorViewData(false)} // Close the view
                        />

                        {/* Modal Content */}
                        <div className="relative bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                            {/* Header Section */}
                            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-bold border border-white/30">
                                        {selectedDoctor.firstName.charAt(0)}{selectedDoctor.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">
                                            Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                                        </h2>
                                        <p className="text-cyan-100 text-sm font-medium">{selectedDoctor.specialization}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDoctorViewData(false)}
                                    className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Body Section */}
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                                {/* Professional Info */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest border-b border-slate-700 pb-2">Professional Details</h3>

                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-semibold">Department & Code</p>
                                        <p className="text-slate-100 font-medium">{selectedDoctor.departmentCode}</p>
                                    </div>

                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-semibold">Experience</p>
                                        <p className="text-slate-100 font-medium">{selectedDoctor.experience || "Not Specified"}</p>
                                    </div>

                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-semibold">Room Number</p>
                                        <p className="text-slate-100 font-mono font-medium">{selectedDoctor.roomNumber}</p>
                                    </div>

                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-semibold">Weekly Availability</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {selectedDoctor.availability?.map((day, i) => (
                                                <span key={i} className="px-2 py-1 bg-slate-900 text-cyan-400 text-[10px] font-bold rounded border border-slate-700 uppercase">
                                                    {day}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact & Personal Info */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest border-b border-slate-700 pb-2">Contact & Personal</h3>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300"><User size={16} /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-semibold">Gender</p>
                                            <p className="text-slate-100 font-medium">{selectedDoctor.gender}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300"><Calendar size={16} /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-semibold">Date of Birth</p>
                                            <p className="text-slate-100 font-medium">{selectedDoctor.dateOfBirth || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300"><Bell size={16} /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-semibold">Phone Number</p>
                                            <p className="text-slate-100 font-medium">{selectedDoctor.phoneNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300"><Activity size={16} /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-semibold">Full Address</p>
                                            <p className="text-slate-100 text-sm leading-relaxed">{selectedDoctor.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Section */}
                            <div className="bg-slate-900/50 p-6 border-t border-slate-700 flex gap-4">
                                <button
                                    onClick={() => setDoctorViewData(false)}
                                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-900/40"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => deleteUser(selectedDoctor.email)} // Implement deleteDoctor function to handle deletion
                                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-900/40"
                                >
                                    Delete Profile
                                </button>
                                {errors && <div className="w-full mt-4 text-center text-red-500 font-medium">{errors}</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Patient View Modal */}
                {patientViewData && selectedPatient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Background Overlay */}
                        <div
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                            onClick={() => setPatientViewData(false)} // Close the view
                        />

                        {/* Modal Content */}
                        <div className="relative bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                            {/* Header Section */}
                            <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-6 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-bold border border-white/30">
                                        {selectedPatient.firstName.charAt(0)}{selectedPatient.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">
                                            {selectedPatient.firstName} {selectedPatient.lastName}
                                        </h2>
                                        <p className="text-sky-100 text-sm font-medium">{selectedPatient.email}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setPatientViewData(false)}
                                    className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Body Section */}
                            <div className="p-8">
                                <h3 className="text-xs font-bold text-sky-500 uppercase tracking-widest border-b border-slate-700 pb-2 mb-6">Contact & Personal Details</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300"><User size={16} /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-semibold">Gender</p>
                                            <p className="text-slate-100 font-medium">{selectedPatient.gender}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300"><Calendar size={16} /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-semibold">Date of Birth</p>
                                            <p className="text-slate-100 font-medium">{selectedPatient.dateOfBirth || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300"><Bell size={16} /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-semibold">Phone Number</p>
                                            <p className="text-slate-100 font-medium">{selectedPatient.phoneNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300"><Activity size={16} /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-semibold">Full Address</p>
                                            <p className="text-slate-100 text-sm leading-relaxed">{selectedPatient.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Section */}
                            <div className="bg-slate-900/50 p-6 border-t border-slate-700 flex gap-4">
                                <button
                                    onClick={() => setPatientViewData(false)}
                                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        deleteUser(selectedPatient.email);
                                        setPatientViewData(false);
                                    }} 
                                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-900/40"
                                >
                                    Delete Profile
                                </button>
                                {errors && <div className="w-full mt-4 text-center text-red-500 font-medium">{errors}</div>}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            {isEditingProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsEditingProfile(false)}
                    />
                    <div className="relative bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                                <p className="text-sm text-slate-400">Update your personal details below.</p>
                            </div>
                            <button
                                onClick={() => setIsEditingProfile(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formError && <div className="rounded-xl bg-red-500/10 border border-red-500/50 p-4 text-red-500 font-semibold">{formError}</div>}
                            {formStatus && <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/50 p-4 text-cyan-400 font-semibold">{formStatus}</div>}

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className="space-y-2 text-sm text-slate-300 font-semibold">
                                    <span>First Name</span>
                                    <input
                                        value={profileForm.firstName}
                                        onChange={(e) => handleEditInput('firstName', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white"
                                    />
                                </label>
                                <label className="space-y-2 text-sm text-slate-300 font-semibold">
                                    <span>Last Name</span>
                                    <input
                                        value={profileForm.lastName}
                                        onChange={(e) => handleEditInput('lastName', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className="space-y-2 text-sm text-slate-300 font-semibold">
                                    <span>Phone Number</span>
                                    <input
                                        value={profileForm.phoneNumber}
                                        onChange={(e) => handleEditInput('phoneNumber', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white"
                                    />
                                </label>
                                <label className="space-y-2 text-sm text-slate-300 font-semibold">
                                    <span>Date of Birth</span>
                                    <input
                                        type="date"
                                        value={profileForm.dateOfBirth}
                                        onChange={(e) => handleEditInput('dateOfBirth', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white"
                                    />
                                </label>
                                <label className="space-y-2 text-sm text-slate-300 font-semibold md:col-span-2">
                                    <span>Gender</span>
                                    <select
                                        value={profileForm.gender}
                                        onChange={(e) => handleEditInput('gender', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="MALE">MALE</option>
                                        <option value="FEMALE">FEMALE</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </label>
                            </div>

                            <label className="space-y-2 text-sm text-slate-300 font-semibold block">
                                <span>Address</span>
                                <textarea
                                    value={profileForm.address}
                                    onChange={(e) => handleEditInput('address', e.target.value)}
                                    className="w-full min-h-[100px] rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white"
                                />
                            </label>

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-6">
                                <button
                                    onClick={() => setIsEditingProfile(false)}
                                    className="w-full sm:w-auto rounded-xl border border-slate-600 bg-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={editProfile}
                                    disabled={loading}
                                    className="w-full sm:w-auto rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-500 transition shadow-lg shadow-cyan-900/20 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}
