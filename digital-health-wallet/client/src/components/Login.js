import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="max-w-md mx-auto mt-16">
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 hover:-translate-y-0.5 transition duration-200">
                    <h2 className="text-center mb-6 text-2xl font-semibold text-gray-900">Login to Health Wallet</h2>
                    {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-500">Username</label>
                        <input
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            onChange={handleChange}
                            required
                            className="p-2.5 w-full border border-gray-200 rounded-lg text-sm mb-4 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition"
                        />

                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-500">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            onChange={handleChange}
                            required
                            className="p-2.5 w-full border border-gray-200 rounded-lg text-sm mb-4 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition"
                        />

                        <button type="submit" className="w-full bg-indigo-600 text-white p-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 active:translate-y-px transition duration-200">
                            Login
                        </button>
                    </form>
                </div>
                <div className="text-center mt-4 text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
