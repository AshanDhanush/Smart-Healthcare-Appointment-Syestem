"use client";


import Navbar from "@/components/Navbar";
import { Search, MapPin, Stethoscope, Clock, Award } from "lucide-react";
import { useState , useEffect} from "react";

const MOCK_DOCTORS = [

  {
    id: 1,
    name: "Dr. Aruni Perera",
    specialization: "Interventional Cardiology",
    departmentCode: "CARD",
    experience: "12 years",
    roomNumber: "A-201",
    availability: ["Mon", "Wed", "Fri"],
    email: "aruni.p@healthsync.lk"
  },
  {
    id: 2,
    name: "Dr. Sunil Perera",
    specialization: "Laparoscopic Surgeon",
    departmentCode: "SURG",
    experience: "20 years",
    roomNumber: "D-101",
    availability: ["Tue", "Thu"],
    email: "sunil.p@healthsync.lk"
  },
  {
    id: 3,
    name: "Dr. Kasun Jayawardena",
    specialization: "Neurosurgeon",
    departmentCode: "NEUR",
    experience: "8 years",
    roomNumber: "B-105",
    availability: ["Mon", "Thu"],
    email: "kasun.j@healthsync.lk"
  },
  {
    id: 4,
    name: "Dr. Minoli Silva",
    specialization: "Pediatrician",
    departmentCode: "PEDS",
    experience: "15 years",
    roomNumber: "C-G02",
    availability: ["Wed", "Fri", "Sat"],
    email: "minoli.s@healthsync.lk"
  },
  {
    id: 5,
    name: "Dr. Tharindu Fernando",
    specialization: "Sports Medicine",
    departmentCode: "ORTH",
    experience: "10 years",
    roomNumber: "A-G10",
    availability: ["Tue", "Sat"],
    email: "tharindu.f@healthsync.lk"
  }

]

export default function DoctorSearchPage() {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState("ALL");
    const [selectedDepartment, setSelectedDepartment] = useState("ALL");
    const [filteredDoctors, setFilteredDoctors] = useState(MOCK_DOCTORS);
    
    useEffect(() => {
    const results = MOCK_DOCTORS.filter(doc => {
        
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = selectedDepartment === 'ALL' || selectedDepartment === "" || 
                            doc.departmentCode === selectedDepartment;

        const matchesSpec = selectedSpecialization === 'ALL' || selectedSpecialization === "" || 
                            doc.specialization === selectedSpecialization;

        return matchesSearch && matchesDept && matchesSpec;
    });

    setFilteredDoctors(results);
    
    
}, [searchTerm, selectedDepartment, selectedSpecialization]);

    return(
        <div className="flex flex-col">
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="">

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
                                    <option value="Interventional Cardiology">Cardiology</option>
                                    <option value="Laparoscopic Surgeon">Surgery</option>
                                    <option value="Neurosurgeon">Neurology</option>
                                    <option value="Pediatrician">Pediatrics</option>
                                    <option value="Sports Medicine">Orthopedics</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-slate-600 font-medium">
                            <span className="text-blue-600 font-bold text-lg">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {/* Doctor Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 border border-slate-100 p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden flex flex-col h-full"
                            >
                                {/* Decorative Background element */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                
                                {/* Doctor Image (Placeholder) */}
                                <div className="flex justify-center mb-5 relative z-10">
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                        <Stethoscope className="w-14 h-14 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="text-center mb-6 relative z-10 flex-grow">
                                    <h3 className="text-xl font-bold text-slate-800 mb-1.5 group-hover:text-blue-600 transition-colors">
                                        {doctor.name}
                                    </h3>
                                    <p className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4 border border-blue-100">
                                        {doctor.specialization}
                                    </p>
                                    
                                    <div className="space-y-2.5 text-slate-600 text-sm font-medium bg-slate-50 rounded-xl p-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <div className="flex items-center justify-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            <span>{doctor.availability.join(", ")}</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <MapPin className="w-4 h-4 text-rose-500" />
                                            <span>Room {doctor.roomNumber}</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Award className="w-4 h-4 text-amber-500" />
                                            <span>{doctor.experience}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="flex justify-center gap-3 relative z-10 mt-auto">
                                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 font-semibold">
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* No Results Message */}
                        {filteredDoctors.length === 0 && (
                            <div className="md:col-span-2 lg:col-span-3 text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-12 h-12 text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                    No doctors found
                                </h3>
                                <p className="text-slate-600 text-lg">
                                    Try adjusting your search or filters to find what you're looking for.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>

        </div>
        
    );
}

