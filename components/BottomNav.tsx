import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Role } from '../types.ts';
import Icon from './ui/Icon.tsx';

const BottomNav: React.FC = () => {
    const { activeView, setActiveView, currentUser, openTransactionForm } = useAppContext();

    const navItems = [
        { view: 'dashboard', label: 'Ringkasan', icon: 'Home', roles: [Role.ADMIN, Role.VIEWER] },
        { view: 'transactions', label: 'Transaksi', icon: 'History', roles: [Role.ADMIN, Role.VIEWER] },
        // Placeholder for Add button
        { view: 'add', label: '', icon: 'Plus', roles: [Role.ADMIN, Role.VIEWER] },
        { view: 'management', label: 'Anggaran', icon: 'Target', roles: [Role.ADMIN] },
        { view: 'profile', label: 'Akun', icon: 'User', roles: [Role.ADMIN, Role.VIEWER] },
    ];
    
    const handleNavClick = (view: string) => {
        if (view === 'add') {
             if (currentUser?.role === Role.ADMIN) {
                openTransactionForm();
             }
        } else {
            setActiveView(view as any);
        }
    };

    const permittedNavItems = navItems.filter(item => item.roles.includes(currentUser!.role));

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-base-100 shadow-lg" style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' }}>
            <div className="flex justify-around items-center h-16 relative">
                {permittedNavItems.map(item => {
                    const isActive = activeView === item.view;
                    if (item.view === 'add') {
                        return (
                            <div key={item.view} className="w-1/5">
                                <button
                                    onClick={() => handleNavClick(item.view)}
                                    className="absolute left-1/2 -translate-x-1/2 -top-6 w-16 h-16 bg-success rounded-full shadow-lg text-white flex items-center justify-center disabled:bg-gray-500"
                                    disabled={currentUser?.role !== Role.ADMIN}
                                >
                                    <Icon name="Plus" size={32} />
                                </button>
                            </div>
                        );
                    }
                    return (
                        <button
                            key={item.view}
                            onClick={() => handleNavClick(item.view)}
                            className={`flex flex-col items-center justify-center w-1/5 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-400'}`}
                        >
                            <Icon name={item.icon as any} size={24} />
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;