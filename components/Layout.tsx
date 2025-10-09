import React from 'react';
import BottomNav from './BottomNav.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col h-screen font-sans">
            <main className="flex-1 overflow-y-auto pb-24 bg-base-300">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};

export default Layout;