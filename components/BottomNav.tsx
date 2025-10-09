import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Role } from '../types.ts';
import Icon from './ui/Icon.tsx';

const BottomNav: React.FC = () => {
    const { activeView, setActiveView, currentUser, openTransactionForm } = useAppContext();

    const navItems = [
        { view: 'dashboard', label: 'Ringkasan', icon: 'Home', roles: [Role.ADMIN, Role.VIEWER] },
        { view: 'transactions', label: 'Transaksi', icon: 'BookOpen', roles: [Role.ADMIN, Role.VIEWER] },
        { view: 'add', label: '', icon: 'Plus', roles: [Role.ADMIN, Role.VIEWER] },
        { view: 'management', label: 'Anggaran', icon: 'PieChart', roles: [Role.ADMIN] },
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
        <div className="fixed bottom-0 left-0 right-0 bg-base-100 z-30 border-t border-base-300">
            <div className="flex justify-around items-center h-16 relative">
                {permittedNavItems.map(item => {
                    const isActive = activeView === item.view;
                    if (item.view === 'add') {
                        return (
                            <div key={item.view} className="w-1/5 flex justify-center">
                                <button
                                    onClick={() => handleNavClick(item.view)}
                                    className="absolute -top-5 w-14 h-14 bg-success hover:bg-success-focus transition-transform active:scale-95 rounded-full shadow-lg text-white flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
                                    disabled={currentUser?.role !== Role.ADMIN}
                                    aria-label="Tambah Transaksi"
                                >
                                    <Icon name="Plus" size={28} />
                                </button>
                            </div>
                        );
                    }
                    return (
                        <button
                            key={item.view}
                            onClick={() => handleNavClick(item.view)}
                            className={`flex flex-col items-center justify-center w-1/5 transition-colors duration-200 p-2 rounded-lg ${isActive ? 'text-base-content font-bold' : 'text-base-content/60 hover:text-base-content'}`}
                             aria-label={item.label}
                        >
                            <Icon name={item.icon as any} size={22} />
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;