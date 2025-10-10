import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import Icon from './ui/Icon.tsx';
import { User } from '../types.ts';

const Profile: React.FC = () => {
    const { currentUser, updateProfile, logout } = useAppContext();
    const [formData, setFormData] = useState<User | null>(null);

    useEffect(() => {
        if (currentUser) {
            setFormData({ ...currentUser });
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            // In a real app, you'd handle password confirmation and hashing here
            updateProfile(formData);
        }
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-base-content">Profil Saya</h1>

            <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input input-bordered w-full mt-1"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="input input-bordered w-full mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            className="input input-bordered w-full mt-1"
                        />
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full">
                            Save Changes
                        </button>
                    </div>
                </form>
                <div className="divider my-6"></div>
                <button onClick={logout} className="btn btn-error btn-outline w-full">
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;