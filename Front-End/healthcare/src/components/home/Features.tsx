"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Stethoscope, Clock, Shield, Activity, Users, PhoneCall } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Expert Specialists",
      description: "Our team includes highly qualified doctors from various medical specialties to provide comprehensive care.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Medical emergencies don't wait. Our emergency department and support staff are available round the clock.",
      color: "text-teal-600",
      bg: "bg-teal-50"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Advanced Technology",
      description: "We utilize state-of-the-art medical equipment and modern facilities for accurate diagnosis and treatment.",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Quality Care",
      description: "We prioritize patient safety and adhere to the highest standards of clinical excellence and hygiene.",
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Patient-Centric",
      description: "Our approach focuses on the holistic well-being of our patients, ensuring comfort and personalized attention.",
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      icon: <PhoneCall className="w-8 h-8" />,
      title: "Easy Appointments",
      description: "Book and manage your medical appointments seamlessly through our modern digital healthcare platform.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-24 bg-white" id="departments">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-2"
          >
            Why Choose Us
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6"
          >
            Dedicated to Excellence in Healthcare
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            We combine medical expertise, compassionate care, and modern technology to provide you with the best possible healthcare experience.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                {feature.title}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
