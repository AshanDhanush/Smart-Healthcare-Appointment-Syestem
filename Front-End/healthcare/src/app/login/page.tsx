"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';




export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Reset error on new attempt

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: email,
                password: password
            });

            // FIX: Correctly destructuring user and token from response data
            const { user, token } = response.data;

            login(user, token);

            if (user.role === 'PATIENT') {
                router.push("/");
                console.log("Patient logged in", user.name);
            }
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                setError( "Invalid email or password");
            } else {
                setError("Network error. Is the server running?");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4 py-10">
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[700px] h-[700px] bg-gradient-to-br from-cyan-200 to-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="absolute bottom-50 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-gradient-to-tr from-teal-200 to-cyan-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="w-full max-w-md bg-white border border-cyan-200 shadow-xl shadow-cyan-500/10 rounded-2xl p-8 relative z-10">
                <div className="mb-8 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 font-semibold">Welcome back</p>
                    <h1 className="mt-3 text-3xl font-bold text-slate-900">Login to your account</h1>
                    <p className="mt-2 text-sm text-slate-600">Access your healthcare dashboard and manage your appointments.</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition duration-200 hover:from-cyan-600 hover:to-teal-600 hover:shadow-lg hover:shadow-cyan-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-semibold text-cyan-600 hover:text-cyan-700 transition">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
}