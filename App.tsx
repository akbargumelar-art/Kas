
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext.tsx';
import Login from './components/Login.tsx';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import Transactions from './components/Transactions.tsx';
import Management from './components/Management.tsx';

const AppContent: React.FC = () => {
    const { currentUser, activeView } = useAppContext();

    if (!currentUser) {
        return <Login />;
    }

    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard />;
            case 'transactions':
                return <Transactions />;
            case 'management':
                return <Management />;
            default:
                return <Dashboard />;
        }
    };

    return <Layout>{renderActiveView()}</Layout>;
};


const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;