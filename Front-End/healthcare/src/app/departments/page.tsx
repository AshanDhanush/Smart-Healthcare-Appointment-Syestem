"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Brain, Baby, Bone, Syringe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const departments = [
  {
    name: "Cardiology",
    icon: Activity,
    description:
      "Our Cardiology department provides comprehensive care for the heart and blood vessels. We specialize in diagnosing and treating heart diseases, offering advanced treatments and compassionate care.",
    color: "bg-red-50 text-red-600 border-red-100",
    iconBg: "bg-red-100",
  },
  {
    name: "Neurology",
    icon: Brain,
    description:
      "The Neurology department is dedicated to diagnosing and treating disorders of the nervous system, including the brain, spinal cord, and nerves, using state-of-the-art technology.",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    iconBg: "bg-purple-100",
  },
  {
    name: "Pediatrics",
    icon: Baby,
    description:
      "Our Pediatrics department focuses on the physical, emotional, and social health of children from birth to young adulthood. We provide a warm and welcoming environment for our youngest patients.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    iconBg: "bg-blue-100",
  },
  {
    name: "Orthopedics",
    icon: Bone,
    description:
      "Orthopedics specializes in the musculoskeletal system, providing expert care for bones, joints, ligaments, tendons, and muscles to help you regain mobility and live pain-free.",
    color: "bg-orange-50 text-orange-600 border-orange-100",
    iconBg: "bg-orange-100",
  },
  {
    name: "General Surgery",
    icon: Syringe,
    description:
      "Our General Surgery department offers a wide range of surgical procedures. Our highly skilled surgeons utilize minimally invasive techniques to ensure the best possible outcomes and faster recovery.",
    color: "bg-teal-50 text-teal-600 border-teal-100",
    iconBg: "bg-teal-100",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl lg:text-6xl tracking-tight mb-4">
              Our Medical <span className="text-blue-600">Departments</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
              Discover our comprehensive range of specialized medical services. Our expert teams are dedicated to providing world-class healthcare tailored to your needs.
            </p>
          </motion.div>
        </div>

        {/* Departments Grid */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                variants={itemVariants}
                whileHover={{ scale: 1.03, translateY: -5 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-8">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${dept.iconBg} ${dept.color.split(" ")[1]}`}
                  >
                    <dept.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {dept.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {dept.description}
                  </p>
                  <div className="pt-4 border-t border-slate-100">
                    <a
                      href="#"
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Learn more
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Contact Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mt-24 bg-blue-600 rounded-3xl overflow-hidden shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-blue-600 mix-blend-multiply opacity-20"></div>
          <div className="relative p-8 md:p-12 text-center md:flex md:items-center md:justify-between md:text-left">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-white mb-4">
                Need to book an appointment?
              </h2>
              <p className="text-blue-100 text-lg">
                Our specialists are ready to provide you with the best medical care. Schedule your visit today.
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:w-1/3 md:text-right">
              <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-600 bg-white rounded-full hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Book Appointment
              </button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
