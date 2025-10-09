import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Login: React.FC = () => {
    const { login } = useAppContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await login(username, password);
        if (!success) {
            setError('Invalid username or password.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="max-w-md w-full bg-base-100 p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral">Kas Ciraya</h1>
                    <p className="text-secondary mt-2">Please sign in to continue</p>
                </div>
                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-error/20 text-error font-bold p-3 rounded-md mb-4 text-center">
                           {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            required
                            disabled={isLoading}
                        />
                    </div>
                     <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-content font-bold py-2 px-4 rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:bg-gray-400"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-base-200 rounded-lg text-sm">
                    <h4 className="font-bold text-neutral mb-2">Demo Accounts:</h4>
                    <ul className="list-disc list-inside text-secondary space-y-1">
                        <li><strong>admin</strong> / <strong>password123</strong> (Admin)</li>
                        <li><strong>viewer_a</strong> / <strong>password123</strong> (Viewer)</li>
                        <li><strong>viewer_b</strong> / <strong>password123</strong> (Viewer)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Login;
