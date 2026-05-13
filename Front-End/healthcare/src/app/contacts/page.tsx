"use client"

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar"
import axios from "axios";
import { motion } from 'framer-motion';
import { Home, Mail, Phone, Send } from "lucide-react";
import { useState } from 'react';

export default function Contacts() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [messages, setMessages] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:8080/api/messages/save', {
                name,
                email,
                messages,
            });

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(errorData.message || 'Failed to send message');
            }

            const data = response.data;
            setSuccess('Message sent successfully!');
            setName('');
            setEmail('');
            setMessages('');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };  

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <section className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50/50">
                <div className="max-w-7xl mx-auto flex flex-col items-center mb-16">
                    <div className="flex md:flex-row flex-col gap-3 md:gap-4 justify-center items-center">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-slate-800">
                            We Are  
                        </motion.h1>
                        <motion.h1
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                            Here to Help You Heal.
                        </motion.h1>
                    </div>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 font-medium text-center max-w-3xl mt-6"
                    >
                        Reach out to the HealthSync team for appointments, medical inquiries, or technical support with our smart portal.
                    </motion.p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 mt-4">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }} 
                        className="flex flex-col gap-6 justify-center md:px-10 lg:px-12"
                    >
                        <div className="flex items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 shadow-inner border border-blue-100 rounded-full p-4 mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Mail className="w-8 h-8 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-400 text-sm tracking-wider uppercase mb-1">Email Us</span>
                                <p className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">healthcare@healthsync.lk</p>
                            </div>
                        </div>

                        <div className="flex items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 shadow-inner border border-blue-100 rounded-full p-4 mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Phone className="w-8 h-8 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-400 text-sm tracking-wider uppercase mb-1">Call Us</span>
                                <p className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">+94 11 234 5678</p>
                            </div>
                        </div>

                        <div className="flex items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 shadow-inner border border-blue-100 rounded-full p-4 mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Home className="w-8 h-8 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-400 text-sm tracking-wider uppercase mb-1">Visit Us</span>
                                <p className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-relaxed">123 Healthcare Street, Wellness City, Colombo 03</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Message Box */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 flex flex-col gap-6 relative overflow-hidden"
                    >
                        {/* Decorative subtle background elements */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mt-20 -mr-20 pointer-events-none" />

                        <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight relative z-10">Send Message</h2>
                        
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold relative z-10">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm font-semibold relative z-10">
                                {success}
                            </div>
                        )}
                        
                        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        placeholder="Ashan Dhanushka"
                                        className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all hover:border-blue-300 bg-slate-50 focus:bg-white text-slate-800 font-medium placeholder-slate-400" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Email</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="ashandhanushka100@gmail.com"
                                        className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all hover:border-blue-300 bg-slate-50 focus:bg-white text-slate-800 font-medium placeholder-slate-400" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Message</label>
                                <textarea 
                                    rows={4} 
                                    required
                                    value={messages} 
                                    onChange={(e) => setMessages(e.target.value)} 
                                    placeholder="How can we help you today?"
                                    className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all hover:border-blue-300 bg-slate-50 focus:bg-white text-slate-800 font-medium placeholder-slate-400 resize-none"
                                ></textarea>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-95 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending Message...' : 'Send Message'}
                                    <Send className="w-5 h-5 ml-3" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}