import React, { useState } from 'react';
import { uploadReport } from '../services/api';

const UploadReport = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [type, setType] = useState('Lab Report');
    const [date, setDate] = useState('');
    const [vitals, setVitals] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('report', file);
        formData.append('type', type);
        formData.append('date', date);
        formData.append('vitals', vitals);

        try {
            await uploadReport(formData);
            alert('Report uploaded successfully');
            // Reset form
            setFile(null);
            setDate('');
            setVitals('');
            document.getElementById('fileInput').value = '';
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            alert(err.response?.data?.error || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 hover:-translate-y-0.5 transition duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Report</h3>
            <form onSubmit={handleSubmit}>
                <label className="block mb-1 text-sm font-medium text-gray-500">Select File (PDF/Image)</label>
                <input
                    id="fileInput"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept="image/*,application/pdf"
                    required
                    className="p-2.5 w-full border border-gray-200 rounded-lg text-sm mb-4 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition"
                />

                <label className="block mb-1 text-sm font-medium text-gray-500">Report Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}
                    className="p-2.5 w-full border border-gray-200 rounded-lg text-sm mb-4 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition">
                    <option value="Lab Report">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Test Report">Test Report</option>
                </select>

                <label className="block mb-1 text-sm font-medium text-gray-500">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                    className="p-2.5 w-full border border-gray-200 rounded-lg text-sm mb-4 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition" />

                <label className="block mb-1 text-sm font-medium text-gray-500">Quick Vitals (Optional)</label>
                <input
                    type="text"
                    placeholder="e.g., BP: 120/80"
                    value={vitals}
                    onChange={(e) => setVitals(e.target.value)}
                    className="p-2.5 w-full border border-gray-200 rounded-lg text-sm mb-4 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition"
                />

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 active:translate-y-px transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Uploading...' : 'Upload Report'}
                </button>
            </form>
        </div>
    );
};

export default UploadReport;
