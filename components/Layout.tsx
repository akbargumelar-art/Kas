import React from 'react';
import BottomNav from './BottomNav.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen font-sans bg-neutral">
            <main className="flex-1 overflow-y-auto pb-24">
                <div className="p-4">
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    );
};

export default Layout;