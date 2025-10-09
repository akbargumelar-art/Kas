import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import Icon from './ui/Icon.tsx';
import { User, Wallet, Category, Role, CategoryType } from '../types.ts';
import UserForm from './UserForm.tsx';
import WalletForm from './WalletForm.tsx';
import CategoryForm from './CategoryForm.tsx';


const Management: React.FC = () => {
    const { users, wallets, categories, deleteUser, deleteWallet, deleteCategory } = useAppContext();
    const [activeTab, setActiveTab] = useState('users');

    // State for modals
    const [isUserFormOpen, setUserFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isWalletFormOpen, setWalletFormOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
    const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const openUserForm = (user: User | null = null) => {
        setEditingUser(user);
        setUserFormOpen(true);
    };
    const openWalletForm = (wallet: Wallet | null = null) => {
        setEditingWallet(wallet);
        setWalletFormOpen(true);
    };
    const openCategoryForm = (category: Category | null = null) => {
        setEditingCategory(category);
        setCategoryFormOpen(true);
    };
    
    const handleDeleteUser = (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(userId);
        }
    };
    const handleDeleteWallet = (walletId: number) => {
        if (window.confirm('Are you sure you want to delete this wallet?')) {
            deleteWallet(walletId);
        }
    };
    const handleDeleteCategory = (categoryId: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory(categoryId);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <div>
                        <button onClick={() => openUserForm()} className="btn btn-primary mb-4">Add User</button>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.username}</td>
                                            <td><span className="badge badge-ghost">{user.role}</span></td>
                                            <td className="flex gap-2">
                                                <button onClick={() => openUserForm(user)} className="btn btn-sm btn-outline"><Icon name="Edit" size={16} /></button>
                                                <button onClick={() => handleDeleteUser(user.id)} className="btn btn-sm btn-outline btn-error"><Icon name="Trash2" size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'wallets':
                return (
                     <div>
                        <button onClick={() => openWalletForm()} className="btn btn-primary mb-4">Add Wallet</button>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Initial Balance</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wallets.map(wallet => (
                                        <tr key={wallet.id}>
                                            <td>{wallet.name}</td>
                                            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(wallet.initialBalance)}</td>
                                            <td className="flex gap-2">
                                                <button onClick={() => openWalletForm(wallet)} className="btn btn-sm btn-outline"><Icon name="Edit" size={16} /></button>
                                                <button onClick={() => handleDeleteWallet(wallet.id)} className="btn btn-sm btn-outline btn-error"><Icon name="Trash2" size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'categories':
                 return (
                     <div>
                        <button onClick={() => openCategoryForm()} className="btn btn-primary mb-4">Add Category</button>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Icon</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(cat => (
                                        <tr key={cat.id}>
                                            <td><Icon name={cat.icon as any} /></td>
                                            <td>{cat.name}</td>
                                            <td><span className={`badge ${cat.type === CategoryType.INCOME ? 'badge-success' : 'badge-error'}`}>{cat.type}</span></td>
                                            <td className="flex gap-2">
                                                <button onClick={() => openCategoryForm(cat)} className="btn btn-sm btn-outline"><Icon name="Edit" size={16} /></button>
                                                <button onClick={() => handleDeleteCategory(cat.id)} className="btn btn-sm btn-outline btn-error"><Icon name="Trash2" size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral">Management</h1>

            <div role="tablist" className="tabs tabs-boxed">
                <a role="tab" className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`} onClick={() => setActiveTab('users')}>Users</a>
                <a role="tab" className={`tab ${activeTab === 'wallets' ? 'tab-active' : ''}`} onClick={() => setActiveTab('wallets')}>Wallets</a>
                <a role="tab" className={`tab ${activeTab === 'categories' ? 'tab-active' : ''}`} onClick={() => setActiveTab('categories')}>Categories</a>
            </div>

            <div className="bg-base-100 p-6 rounded-xl shadow">
                {renderContent()}
            </div>
            
            {isUserFormOpen && <UserForm user={editingUser} onClose={() => setUserFormOpen(false)} />}
            {isWalletFormOpen && <WalletForm wallet={editingWallet} onClose={() => setWalletFormOpen(false)} />}
            {isCategoryFormOpen && <CategoryForm category={editingCategory} onClose={() => setCategoryFormOpen(false)} />}

        </div>
    );
};

export default Management;
