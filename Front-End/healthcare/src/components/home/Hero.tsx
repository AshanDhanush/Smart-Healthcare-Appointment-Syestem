"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Calendar, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import heroImage from '@/assets/hero.png';

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50 min-h-[90vh] flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-gradient-to-br from-teal-100 to-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100 to-teal-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 font-medium mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
              Accepting New Patients
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6"
            >
              Your Health, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                Our Top Priority
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed"
            >
              Experience world-class healthcare with our team of expert medical professionals. 
              Book your appointment today and take the first step towards better health.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/book">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                  Book Appointment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/doctors">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-teal-500 hover:text-teal-600 transition-all duration-300 flex items-center justify-center">
                  Find a Doctor
                </button>
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div>
                <p className="text-3xl font-bold text-slate-900">50+</p>
                <p className="text-sm text-slate-500 font-medium">Specialists</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">24/7</p>
                <p className="text-sm text-slate-500 font-medium">Emergency</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">10k+</p>
                <p className="text-sm text-slate-500 font-medium">Happy Patients</p>
              </div>
            </motion.div>

          </motion.div>

          {/* Hero Image/Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main Image Placeholder */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] bg-slate-200">
              <Image 
                src={heroImage} 
                alt="Professional Doctor" 
                className="object-cover w-full h-full"
                priority
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Floating Cards */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -left-12 top-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="bg-teal-100 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Easy Booking</p>
                <p className="text-xs text-slate-500">Online 24/7</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -right-12 bottom-32 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="bg-blue-100 p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Certified</p>
                <p className="text-xs text-slate-500">Expert Doctors</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
