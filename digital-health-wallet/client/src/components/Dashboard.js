import React, { useEffect, useState } from 'react';
import { getReports, getReportsWithParams, getSharedReports, addVitals, deleteReport, removeSharedReport } from '../services/api';
import UploadReport from './UploadReport';
import VitalsChart from './VitalsChart';
import ShareAccess from './ShareAccess';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [sharedReports, setSharedReports] = useState([]);
    const [vitalsInput, setVitalsInput] = useState({ date: '', systolic: '', diastolic: '', heart_rate: '' });
    const [refreshVitals, setRefreshVitals] = useState(0);
    const [filters, setFilters] = useState({ type: '', date: '' });
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const fetchData = () => {
        let query = '';
        if (filters.type) query += `?type=${filters.type}`;
        if (filters.date) query += `${query ? '&' : '?'}date=${filters.date}`;

        getReportsWithParams(query).then(res => setReports(res.data)).catch(console.error);
        getSharedReports().then(res => setSharedReports(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleAddVitals = async (e) => {
        e.preventDefault();
        try {
            await addVitals(vitalsInput);
            setVitalsInput({ date: '', systolic: '', diastolic: '', heart_rate: '' });
            setRefreshVitals(prev => prev + 1);
            alert('Vitals logged');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteReport = async (id) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;
        try {
            await deleteReport(id);
            fetchData(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Failed to delete report');
        }
    };

    const handleRemoveShared = async (id) => {
        if (!window.confirm('Remove this shared report?')) return;
        try {
            await removeSharedReport(id);
            fetchData(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Failed to remove shared report');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm sticky top-4 z-10 border border-gray-200">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Health Wallet</h1>
                    <span className="text-sm text-gray-500">Welcome back, {username}</span>
                </div>
                <button className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2.5 rounded-lg font-medium transition text-sm" onClick={handleLogout}>Logout</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Column: Actions */}
                <div className="col-span-1 md:col-span-6 lg:col-span-4 space-y-6">
                    <UploadReport onUploadSuccess={fetchData} />

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:-translate-y-0.5 transition duration-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Vitals Log</h3>
                        <form onSubmit={handleAddVitals}>
                            <label className="block mb-1 text-sm font-medium text-gray-500">Date</label>
                            <input type="date" value={vitalsInput.date} onChange={e => setVitalsInput({ ...vitalsInput, date: e.target.value })} required
                                className="p-2.5 w-full border border-gray-200 rounded-lg text-sm mb-4 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition" />

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-500">Sys</label>
                                    <input placeholder="120" value={vitalsInput.systolic} onChange={e => setVitalsInput({ ...vitalsInput, systolic: e.target.value })} required
                                        className="p-2.5 w-full border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition" />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-500">Dia</label>
                                    <input placeholder="80" value={vitalsInput.diastolic} onChange={e => setVitalsInput({ ...vitalsInput, diastolic: e.target.value })} required
                                        className="p-2.5 w-full border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition" />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-500">HR</label>
                                    <input placeholder="70" value={vitalsInput.heart_rate} onChange={e => setVitalsInput({ ...vitalsInput, heart_rate: e.target.value })} required
                                        className="p-2.5 w-full border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition" />
                                </div>
                            </div>
                            <button type="submit" className="w-full mt-4 bg-indigo-600 text-white p-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 active:translate-y-px transition duration-200">Log Vitals</button>
                        </form>
                    </div>

                    <ShareAccess reports={reports} />
                </div>

                {/* Right Column: Visualization & Reports */}
                <div className="col-span-1 md:col-span-6 lg:col-span-8 space-y-6">
                    <VitalsChart refreshTrigger={refreshVitals} />

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:-translate-y-0.5 transition duration-200">
                        <div className="flex justify-between items-center flex-wrap mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">My Reports</h3>
                            <div className="flex gap-2 items-center">
                                <select
                                    value={filters.type}
                                    onChange={e => setFilters({ ...filters, type: e.target.value })}
                                    className="p-1.5 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:border-indigo-600"
                                >
                                    <option value="">All Types</option>
                                    <option value="Lab Report">Lab Report</option>
                                    <option value="Prescription">Prescription</option>
                                    <option value="Imaging">Imaging</option>
                                    <option value="Test Report">Test Report</option>
                                </select>
                                <input
                                    type="date"
                                    value={filters.date}
                                    onChange={e => setFilters({ ...filters, date: e.target.value })}
                                    className="p-1.5 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:border-indigo-600"
                                />
                                {(filters.type || filters.date) &&
                                    <button
                                        onClick={() => setFilters({ type: '', date: '' })}
                                        className="py-1.5 px-3 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                    >
                                        Clear
                                    </button>
                                }
                            </div>
                        </div>

                        {reports.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No reports found.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {reports.map(r => (
                                    <li key={r.id} className="py-3 flex justify-between items-center">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-900">{r.type}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                                                {r.filename}
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end ml-4">
                                            <div className="text-sm text-gray-900">{r.date}</div>
                                            {r.vitals && <div className="text-xs text-emerald-500 font-medium">{r.vitals}</div>}
                                            <a
                                                href={`http://localhost:5001/uploads/${r.filename}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-indigo-600 font-medium hover:text-indigo-800 mt-1 max-w-[200px]"
                                            >
                                                View File
                                            </a>
                                            <button
                                                onClick={() => handleDeleteReport(r.id)}
                                                className="text-xs text-red-500 hover:text-red-700 mt-2 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:-translate-y-0.5 transition duration-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shared With Me</h3>
                        {sharedReports.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No shared reports.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {sharedReports.map(r => (
                                    <li key={r.id} className="py-3 flex justify-between items-center">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-900">{r.type}</div>
                                            <div className="text-sm text-gray-500">From: {r.owner_name}</div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="text-sm text-gray-900 mb-1">{r.date}</div>
                                            <a
                                                href={`http://localhost:5001/uploads/${r.filename}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
                                            >
                                                View File
                                            </a>
                                            <button
                                                onClick={() => handleRemoveShared(r.id)}
                                                className="text-xs text-red-500 hover:text-red-700 mt-1 ml-3 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
