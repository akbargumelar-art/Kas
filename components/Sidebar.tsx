import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Role } from '../types.ts';
import Icon from './ui/Icon.tsx';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const { currentUser, activeView, setActiveView, logout } = useAppContext();

    const navItems = [
        { view: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: [Role.ADMIN, Role.VIEWER] },
        { view: 'transactions', label: 'Transactions', icon: 'ArrowRightLeft', roles: [Role.ADMIN] },
        { view: 'management', label: 'Management', icon: 'Settings', roles: [Role.ADMIN] },
    ];

    const handleNavClick = (view: 'dashboard' | 'transactions' | 'management' | 'profile') => {
        setActiveView(view as any);
        if (window.innerWidth < 768) { // md breakpoint
            setIsOpen(false);
        }
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <aside className={`absolute md:relative inset-y-0 left-0 bg-neutral text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}>
                <div className="p-4 text-2xl font-bold border-b border-gray-700 flex items-center">
                    <Icon name="Wallet" className="mr-3" />
                    <span>Kas Ciraya</span>
                </div>
                <nav className="flex-1 p-4">
                    <ul>
                        {navItems.filter(item => item.roles.includes(currentUser!.role)).map((item) => (
                            <li key={item.view}>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleNavClick(item.view as any); }}
                                    className={`flex items-center p-3 my-1 rounded-lg transition-colors ${activeView === item.view ? 'bg-primary' : 'hover:bg-gray-700'}`}
                                >
                                    <Icon name={item.icon as any} className="mr-3" />
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700">
                     <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('profile'); }} className={`flex items-center p-3 rounded-lg transition-colors mb-2 ${activeView === 'profile' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
                        <Icon name="UserCog" className="mr-3" />
                        <span>Profile</span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors">
                        <Icon name="LogOut" className="mr-3" />
                        <span>Logout</span>
                    </a>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
