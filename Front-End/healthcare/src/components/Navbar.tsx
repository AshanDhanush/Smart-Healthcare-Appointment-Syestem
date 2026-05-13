"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, HeartPulse, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Departments', href: '/departments' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Contact', href: '/contacts' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-cyan-200 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg shadow-md">
                <HeartPulse className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-teal-600">
                HealthSync
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <motion.li key={link.label} whileHover={{ y: -2 }}>
                  <Link 
                    href={link.href}
                    className="text-slate-700 font-medium hover:text-cyan-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            
            
            <div className="flex items-center space-x-4 ml-4">

              {user ? (
                 <>
                            <Link href="/patientDashboard">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-slate-700 hover:text-white hover:bg-cyan-500 transition-colors duration-200 font-medium cursor-pointer"
                                >
                                    <User className="w-5 h-5" />
                                    <span>Profile</span>
                                </motion.div>
                            </Link>
                            <button onClick={logout} className="flex items-center gap-2 text-slate-700 font-medium hover:text-cyan-600 transition-colors">
                                Logout
                            </button>
                        </>

              ) : (
                    <Link href='/login'>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-slate-700 font-medium hover:text-cyan-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </motion.button>
              </Link>
              
              )}
              
              <Link href="/book">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  Book Appointment
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="text-slate-700 hover:text-cyan-600 focus:outline-none"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-cyan-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-cyan-100 flex flex-col gap-3">
                {user ? (
                  <>
                  <Link href="/patientDashboard">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex justify-center items-center gap-2 px-3 py-3 text-slate-700 font-medium bg-cyan-50 rounded-md hover:bg-cyan-100 transition-colors cursor-pointer"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </motion.div>
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-center px-3 py-3 text-slate-700 font-medium bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                    Logout
                  </button>
                  </>
                  ):(
                     <Link href="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full flex justify-center items-center gap-2 px-3 py-3 text-slate-700 font-medium bg-cyan-50 rounded-md hover:bg-cyan-100 transition-colors">
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                </Link>
                  )}
                
                <Link href="/book" onClick={() => setIsOpen(false)}>
                  <button className="w-full text-center px-3 py-3 text-white font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    Book Appointment
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
