
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Management from './components/Management';

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
