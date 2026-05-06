"use client";

import React from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  MapPin, 
  PhoneCall, 
  Mail, 
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-teal-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-500 rounded-lg">
                <HeartPulse className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white">
                HealthSync
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Providing world-class healthcare with advanced technology and compassionate care. Your health is our priority, 24/7.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-colors duration-300">
                <span className="font-bold">fb</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-colors duration-300">
                <span className="font-bold">tw</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-colors duration-300">
                <span className="font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['About Us', 'Our Doctors', 'Departments', 'Book Appointment', 'Patient Portal'].map((item) => (
                <li key={item}>
                  <Link href="#" className="flex items-center gap-2 hover:text-teal-400 transition-colors group">
                    <ChevronRight className="w-4 h-4 text-teal-600 group-hover:text-teal-400 transition-colors" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Departments</h3>
            <ul className="space-y-4">
              {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Surgery'].map((item) => (
                <li key={item}>
                  <Link href="#" className="flex items-center gap-2 hover:text-teal-400 transition-colors group">
                    <ChevronRight className="w-4 h-4 text-teal-600 group-hover:text-teal-400 transition-colors" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>123 Medical Center Blvd,<br />Colombo 00700, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <PhoneCall className="w-5 h-5 text-teal-500 shrink-0" />
                <span>+94 (0) 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-teal-500 shrink-0" />
                <span>support@healthsync.com</span>
              </li>
            </ul>
            
            <div className="mt-8 p-4 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-semibold">24/7 Emergency</span>
              </div>
              <p className="text-2xl font-bold text-teal-400">1990</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {currentYear} HealthSync. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
