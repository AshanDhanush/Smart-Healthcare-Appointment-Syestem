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
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <section className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col items-center mb-16">
                    <div className="flex md:flex-row flex-col gap-4">
                        <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-extrabold text-slate-900 sm:text-5xl lg:text-6xl tracking-tight mb-4 text-center bg-slate-700 text-transparent bg-clip-text">
                        We Are  
                    </motion.h1>
                    <motion.h1
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-extrabold text-slate-900 sm:text-5xl lg:text-6xl tracking-tight mb-4 text-center bg-gradient-to-r from-cyan-500 to-teal-500 text-transparent bg-clip-text">
                        Here to Help You Heal.
                    </motion.h1>

                    </div>
                    
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-xl text-blue-500"
                    >
                        Reach out to the HealthSync team for appointments, medical inquiries, or technical support with our smart portal.
                    </motion.span>

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                    {/*contact info*/}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, }} className="flex flex-col gap-6  justify-center md:mx-40">
                        <div className="flex items-center p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="bg-blue-50 text-blue-600 shadow-sm border border-blue-100 rounded-2xl p-3 mr-5 flex-shrink-0">
                                <Mail className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 text-sm tracking-wider mb-1">EMAIL</span>
                                <p className="text-slate-600">healthcare@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="bg-blue-50 text-blue-600 shadow-sm border border-blue-100 rounded-2xl p-3 mr-5 flex-shrink-0">
                                <Phone className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 text-sm tracking-wider mb-1">PHONE</span>
                                <p className="text-slate-600">+1 234 567 890</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="bg-blue-50 text-blue-600 shadow-sm border border-blue-100 rounded-2xl p-3 mr-5 flex-shrink-0">
                                <Home className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 text-sm tracking-wider mb-1">ADDRESS</span>
                                <p className="text-slate-600 leading-relaxed">123 Healthcare Street, Wellness City, Healthland – 123456</p>
                            </div>
                        </div>
                    </motion.div>
                    {/* Message Box*/}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, }}
                        className="bg-white  shadow-sm border border-slate-100 p-6 flex flex-col gap-4"
                    >
                        <h2 className="text-2xl text-slate-700">Send Message</h2>
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        {success && <p className="text-green-600 text-sm">{success}</p>}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-700 ">Name</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-slate-700 ">Email</label>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" />
                                </div>
                            </div>
                            <label className="block text-slate-700 ">Message</label>
                            <textarea rows={4} value={messages} onChange={(e) => setMessages(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"></textarea>
                            <div className="flex justify-end">
                                <button type="submit" disabled={loading} className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 text-white font-bold rounded-2xl hover:-translate-y-1 transition-all shadow-md hover:shadow-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-blue-500 hover:to-blue-600">
                                    {loading ? 'Sending...' : 'Send Message'}
                                    <Send className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        </form>




                    </motion.div>

                </div>
                
            </section>

        </div>

    );
}