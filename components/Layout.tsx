
import React, { useState } from 'react';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import Icon from './ui/Icon.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-base-200">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;