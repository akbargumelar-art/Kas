import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { User, Role } from '../types.ts';
import Icon from './ui/Icon.tsx';

interface UserFormProps {
    user: User | null;
    onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
    const { addUser, updateUser } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: Role.VIEWER,
    });
    
    const isEditing = user !== null;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                name: user.name,
                username: user.username,
                password: '', // Password should not be pre-filled
                role: user.role,
            });
        }
    }, [user, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            updateUser({ ...user, ...formData });
        } else {
            addUser(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
            <div className="bg-base-100 rounded-xl shadow-lg p-6 w-full max-w-lg relative m-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <Icon name="X" size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-neutral">{isEditing ? 'Edit User' : 'Add New User'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder={isEditing ? "Leave blank to keep current" : ""} required={!isEditing} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                            <option value={Role.ADMIN}>Admin</option>
                            <option value={Role.VIEWER}>Viewer</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
