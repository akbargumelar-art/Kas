import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import Icon from './ui/Icon.tsx';

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
        try {
            const success = await login(username, password);
            if (!success) {
                setError('Username atau password salah.');
            }
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Brand Section */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-primary text-primary-content p-12">
                <Icon name="Wallet" size={80} className="mb-6" />
                <h1 className="text-4xl font-bold mb-2">Kas Ciraya</h1>
                <p className="text-lg text-center opacity-80">
                    Kelola keuangan pribadi Anda dengan mudah dan efisien.
                </p>
            </div>

            {/* Form Section */}
            <div className="flex items-center justify-center bg-base-200 p-6 sm:p-12">
                <div className="max-w-md w-full bg-base-100 p-8 rounded-2xl shadow-xl">
                    <div className="text-center mb-8">
                         <div className="lg:hidden mb-6">
                             <Icon name="Wallet" size={48} className="mx-auto text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-neutral">Selamat Datang</h1>
                        <p className="text-base-content/70 mt-2">Silakan masuk untuk melanjutkan</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div role="alert" className="alert alert-error text-sm">
                                <Icon name="AlertTriangle" size={20} />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <div className="relative">
                                <Icon name="User" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input
                                    type="text"
                                    placeholder="e.g. admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input input-bordered w-full pl-10"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                         <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <div className="relative">
                                 <Icon name="Lock" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input input-bordered w-full pl-10"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? <span className="loading loading-spinner"></span> : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;