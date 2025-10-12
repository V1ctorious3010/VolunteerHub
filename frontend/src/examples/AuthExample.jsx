import React, { useState } from 'react';
import useAuth from '../assets/Hook/UseAuth';

const AuthExample = () => {
    const { user, loading, error, logIn, createUser, logOut } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await logIn(formData.email, formData.password);
            console.log('Login successful!');
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Split fullName into firstName and lastName
            const names = formData.fullName.trim().split(' ');
            const firstName = names[0] || '';
            const lastName = names.slice(1).join(' ') || '';

            await createUser({
                email: formData.email,
                password: formData.password,
                firstName: firstName,
                lastName: lastName
            });
            console.log('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await logOut();
            console.log('Logout successful!');
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-4">Loading...</div>;
    }

    if (user) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Welcome, {user.fullName || user.email}!</h2>
                <p className="text-gray-600 mb-4">You are logged in.</p>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Authentication</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Full Name (for registration)"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AuthExample;