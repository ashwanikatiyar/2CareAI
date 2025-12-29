import React, { useState } from 'react';
import { shareReport } from '../services/api';

const ShareAccess = ({ reports }) => {
    const [selectedReport, setSelectedReport] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShare = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            await shareReport({ reportId: selectedReport, viewerUsername: username });
            alert('Report shared successfully');
            setUsername('');
            setSelectedReport('');
        } catch (err) {
            alert('Failed to share report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 hover:-translate-y-0.5 transition duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Access</h3>
            <form onSubmit={handleShare}>
                <label className="block mb-1 text-sm font-medium text-gray-500">Select Report</label>
                <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)} required
                    className="p-2.5 w-full border border-gray-200 rounded-lg text-sm mb-4 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition">
                    <option value="">-- Choose a Report --</option>
                    {reports.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.date} - {r.type}
                        </option>
                    ))}
                </select>

                <label className="block mb-1 text-sm font-medium text-gray-500">Viewer Username</label>
                <input
                    placeholder="Enter username to share with"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="p-2.5 w-full border border-gray-200 rounded-lg text-sm mb-4 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition"
                />

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 active:translate-y-px transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Sharing...' : 'Share Access'}
                </button>
            </form>
        </div>
    );
};

export default ShareAccess;
