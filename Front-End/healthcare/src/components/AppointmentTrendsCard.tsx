"use client"

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarDays, Loader2 } from 'lucide-react';
import axios from 'axios';

interface TrendData {
    date: string;
    totalCount: number;
}

export default function AppointmentTrendsCard() {
    const [chartData, setChartData] = useState<TrendData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                setLoading(true);
                // Calls your freshly made analytics route
                const response = await axios.get('http://localhost:8080/api/appointments/admin/analytics/trends', {
                    withCredentials: true
                });
                setChartData(response.data);
            } catch (err) {
                console.error("Error fetching trend metrics:", err);
                setError("Could not load volume trends.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-[2rem] shadow-xl h-96 flex flex-col items-center justify-center gap-3 w-full">
                <Loader2 className="animate-spin text-cyan-500" size={32} />
                <p className="text-slate-400 font-medium text-sm">Aggregating booking historical trends...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-[2rem] shadow-xl h-96 flex items-center justify-center text-red-400 italic w-full">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-[2rem] shadow-xl space-y-4 w-full">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <CalendarDays className="text-cyan-500" size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-100">Appointment Volume Trends</h3>
                    <p className="text-xs text-slate-400">Exposing operational peaks and platform scaling thresholds</p>
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <defs>
                            {/* Creates a smooth fading glow beneath the area line */}
                            <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                        <XAxis 
                            dataKey="date" 
                            stroke="#94a3b8" 
                            fontSize={12} 
                            tickLine={false}
                            tickFormatter={(tick) => {
                                // Formats "2026-05-18" into just "May 18" for visual simplicity
                                const dateObj = new Date(tick);
                                return isNaN(dateObj.getTime()) ? tick : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }} 
                        />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1e293b', 
                                borderRadius: '1rem', 
                                border: '1px solid #334155', 
                                color: '#f1f5f9',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' 
                            }} 
                            itemStyle={{ color: '#06b6d4' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="totalCount" 
                            name="Total Bookings"
                            stroke="#06b6d4" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#trendGlow)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
