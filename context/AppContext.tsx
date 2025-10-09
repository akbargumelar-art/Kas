import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { User, Role, Wallet, Category, Transaction, CategoryType, UserWalletPermission } from '../types.ts';

// --- MOCK DATA ---

const MOCK_USERS: User[] = [
    { id: 1, username: 'admin', password: 'password123', role: Role.ADMIN },
    { id: 2, username: 'viewer_a', password: 'password123', role: Role.VIEWER },
    { id: 3, username: 'viewer_b', password: 'password123', role: Role.VIEWER },
];

const MOCK_WALLETS: Wallet[] = [
    { id: 1, name: 'Cash', initialBalance: 500000 },
    { id: 2, name: 'Bank BCA', initialBalance: 5000000 },
];

const MOCK_CATEGORIES: Category[] = [
    // Income
    { id: 1, name: 'Salary', type: CategoryType.INCOME, icon: 'Landmark' },
    { id: 2, name: 'Freelance', type: CategoryType.INCOME, icon: 'Briefcase' },
    // Expense
    { id: 101, name: 'Food & Drinks', type: CategoryType.EXPENSE, icon: 'Utensils' },
    { id: 102, name: 'Transportation', type: CategoryType.EXPENSE, icon: 'Car' },
    { id: 103, name: 'Housing', type: CategoryType.EXPENSE, icon: 'Home' },
    { id: 104, name: 'Shopping', type: CategoryType.EXPENSE, icon: 'ShoppingCart' },
    { id: 105, name: 'Entertainment', type: CategoryType.EXPENSE, icon: 'Ticket' },
    { id: 106, name: 'Health', type: CategoryType.EXPENSE, icon: 'HeartPulse' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
    // Last month
    { id: 1, date: '2024-07-01T10:00:00Z', amount: 8000000, type: CategoryType.INCOME, description: 'July Salary', categoryId: 1, walletId: 2, userId: 1 },
    { id: 2, date: '2024-07-05T12:30:00Z', amount: 50000, type: CategoryType.EXPENSE, description: 'Lunch with team', categoryId: 101, walletId: 1, userId: 1 },
    { id: 3, date: '2024-07-10T18:00:00Z', amount: 150000, type: CategoryType.EXPENSE, description: 'GoJek rides', categoryId: 102, walletId: 1, userId: 1 },
    // This month (dynamically set)
    { id: 4, date: new Date(new Date().setDate(1)).toISOString(), amount: 8000000, type: CategoryType.INCOME, description: 'August Salary', categoryId: 1, walletId: 2, userId: 1 },
    { id: 5, date: new Date(new Date().setDate(2)).toISOString(), amount: 1500000, type: CategoryType.EXPENSE, description: 'Monthly Rent', categoryId: 103, walletId: 2, userId: 1 },
    { id: 6, date: new Date(new Date().setDate(3)).toISOString(), amount: 75000, type: CategoryType.EXPENSE, description: 'Coffee meeting', categoryId: 101, walletId: 1, userId: 1, receiptImageUrl: 'https://i.imgur.com/4qFm22b.jpeg' },
    { id: 7, date: new Date(new Date().setDate(4)).toISOString(), amount: 200000, type: CategoryType.EXPENSE, description: 'Cinema tickets', categoryId: 105, walletId: 2, userId: 1 },
    { id: 8, date: new Date(new Date().setDate(5)).toISOString(), amount: 300000, type: CategoryType.EXPENSE, description: 'Weekly groceries', categoryId: 104, walletId: 2, userId: 1, receiptImageUrl: 'https://i.imgur.com/QpP4vRb.jpeg' },
    { id: 9, date: new Date(new Date().setDate(6)).toISOString(), amount: 1200000, type: CategoryType.INCOME, description: 'Freelance Project', categoryId: 2, walletId: 2, userId: 1 },
];

const MOCK_PERMISSIONS: UserWalletPermission[] = [
    { userId: 1, walletId: 1 }, // admin sees all
    { userId: 1, walletId: 2 },
    { userId: 2, walletId: 1 }, // viewer_a can only see Cash
    { userId: 3, walletId: 2 }, // viewer_b can only see Bank BCA
];


// --- CONTEXT ---

type ActiveView = 'dashboard' | 'transactions' | 'management';

interface AppContextType {
    currentUser: User | null;
    activeView: ActiveView;
    wallets: Wallet[];
    transactions: Transaction[];
    categories: Category[];
    login: (username: string, password?: string) => Promise<boolean>;
    logout: () => void;
    setActiveView: (view: ActiveView) => void;
    addTransaction: (transactionData: Omit<Transaction, 'id' | 'userId'>) => void;
    getWalletById: (id: number) => Wallet | undefined;
    getCategoryById: (id: number) => Category | undefined;
    calculateWalletBalance: (walletId: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users] = useState<User[]>(MOCK_USERS);
    const [wallets] = useState<Wallet[]>(MOCK_WALLETS);
    const [categories] = useState<Category[]>(MOCK_CATEGORIES);
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [permissions] = useState<UserWalletPermission[]>(MOCK_PERMISSIONS);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('dashboard');

    const login = useCallback(async (username: string, password?: string): Promise<boolean> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    }, [users]);

    const logout = useCallback(() => {
        setCurrentUser(null);
        setActiveView('dashboard');
    }, []);

    const userWalletPermissions = useMemo(() => {
        if (!currentUser) return [];
        return permissions.filter(p => p.userId === currentUser.id).map(p => p.walletId);
    }, [currentUser, permissions]);

    const visibleWallets = useMemo(() => {
        if (!currentUser) return [];
        if (currentUser.role === Role.ADMIN) return wallets;
        return wallets.filter(w => userWalletPermissions.includes(w.id));
    }, [currentUser, wallets, userWalletPermissions]);

    const visibleTransactions = useMemo(() => {
        if (!currentUser) return [];
        if (currentUser.role === Role.ADMIN) return transactions;
        return transactions.filter(t => userWalletPermissions.includes(t.walletId));
    }, [currentUser, transactions, userWalletPermissions]);

    const addTransaction = useCallback((transactionData: Omit<Transaction, 'id' | 'userId'>) => {
        if (!currentUser || currentUser.role !== Role.ADMIN) return;
        const newTransaction: Transaction = {
            ...transactionData,
            id: Date.now(), // simple unique id
            userId: currentUser.id,
        };
        setTransactions(prev => [newTransaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, [currentUser]);

    const getWalletById = useCallback((id: number) => wallets.find(w => w.id === id), [wallets]);
    const getCategoryById = useCallback((id: number) => categories.find(c => c.id === id), [categories]);

    const calculateWalletBalance = useCallback((walletId: number): number => {
        const wallet = getWalletById(walletId);
        if (!wallet) return 0;

        const balance = visibleTransactions
            .filter(t => t.walletId === walletId)
            .reduce((acc, t) => {
                return t.type === CategoryType.INCOME ? acc + t.amount : acc - t.amount;
            }, wallet.initialBalance);
        
        return balance;
    }, [visibleTransactions, getWalletById]);

    const value: AppContextType = {
        currentUser,
        activeView,
        wallets: visibleWallets,
        transactions: visibleTransactions,
        categories,
        login,
        logout,
        setActiveView,
        addTransaction,
        getWalletById,
        getCategoryById,
        calculateWalletBalance,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};


export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};