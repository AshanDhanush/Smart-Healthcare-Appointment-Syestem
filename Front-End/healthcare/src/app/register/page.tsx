"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        address: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(''); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                dateOfBirth: formData.dateOfBirth || null,
                gender: formData.gender || null,
                phoneNumber: formData.phoneNumber,
                address: formData.address || null,
                role: 'PATIENT'
            });
            const { user, token } = response.data;

            login(user, token);
            if (user.role === 'PATIENT') {
                router.push("/");
            }

        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4 py-8">
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[700px] h-[700px] bg-gradient-to-br from-cyan-200 to-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="absolute bottom-50 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-gradient-to-tr from-teal-200 to-cyan-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="w-full absolute top-10 max-w-2xl bg-white border border-cyan-200 shadow-xl shadow-cyan-500/10 rounded-2xl p-6 relative z-10">
                <div className="mb-6 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 font-semibold">Create Account</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Join HealthSync</h1>
                    <p className="mt-1 text-sm text-slate-600">Register to manage your healthcare appointments.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder="Kamal"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder="Jayasinghe"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50"
                            />
                        </div>
                    </div>

                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50"
                        />
                    </div>

                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Password (min 6 characters)</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50"
                        />
                    </div>

                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                id="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                            <select
                                name="gender"
                                id="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50"
                            >
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                id="phoneNumber"
                                placeholder="+94 (70) 000-0000"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                placeholder="123 Main St"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition duration-200 hover:from-cyan-600 hover:to-teal-600 hover:shadow-lg hover:shadow-cyan-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 mt-6">
                    Already have an account? <Link href="/login" className="font-semibold text-cyan-600 hover:text-cyan-700 transition">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
