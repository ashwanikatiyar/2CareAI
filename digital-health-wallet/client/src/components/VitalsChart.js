import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getVitals } from '../services/api';

const VitalsChart = ({ refreshTrigger }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getVitals().then(res => setData(res.data)).catch(err => console.error(err));
    }, [refreshTrigger]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2.5 border border-gray-200 rounded-lg shadow-md">
                    <p className="m-0 mb-1.5 font-bold text-gray-700">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} style={{ color: entry.color, fontSize: '0.9rem', marginBottom: '3px' }}>
                            {entry.name}: <strong>{entry.value}</strong>
                            <span className="text-xs text-gray-500 ml-1">
                                {entry.name.includes('Rate') ? 'bpm' : 'mmHg'}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 h-[400px] flex flex-col hover:-translate-y-0.5 transition duration-200">
            <div className="flex justify-between items-center mb-2.5">
                <h3 className="m-0 text-lg font-semibold text-gray-900">Vitals Trends</h3>
                <span className="text-xs text-gray-500 italic">
                    Reference: 120/80 mmHg (Normal BP)
                </span>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            padding={{ left: 20, right: 20 }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[40, 'auto']} // Start Y-axis at 40 for better visibility of BP
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '15px' }} iconType="circle" />

                        {/* Reference Lines for Normal BP */}
                        <ReferenceLine y={120} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'Sys 120', position: 'insideRight', fill: '#94a3b8', fontSize: 10 }} />
                        <ReferenceLine y={80} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'Dia 80', position: 'insideRight', fill: '#94a3b8', fontSize: 10 }} />

                        <Line
                            type="monotone"
                            dataKey="systolic"
                            stroke="#6366f1" // Indigo
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 0 }}
                            name="Systolic"
                            animationDuration={1500}
                        />
                        <Line
                            type="monotone"
                            dataKey="diastolic"
                            stroke="#10b981" // Emerald
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 0 }}
                            name="Diastolic"
                            animationDuration={1500}
                        />
                        <Line
                            type="monotone"
                            dataKey="heart_rate"
                            stroke="#f59e0b" // Amber
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 0 }}
                            name="Heart Rate"
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VitalsChart;
