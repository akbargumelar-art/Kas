
import React from 'react';
import { useAppContext } from '../context/AppContext';
import Icon from './ui/Icon';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { currentUser } = useAppContext();

    return (
        <header className="bg-base-100 shadow-sm">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                     <button onClick={onMenuClick} className="text-gray-500 focus:outline-none md:hidden">
                        <Icon name="Menu" size={24} />
                    </button>
                    <div className="flex-1"></div>
                    <div className="flex items-center">
                        <span className="text-right">
                            <span className="font-semibold text-neutral">{currentUser?.username}</span>
                            <br/>
                            <span className="text-sm text-secondary capitalize">{currentUser?.role}</span>
                        </span>
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center ml-4">
                            <Icon name="User" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
