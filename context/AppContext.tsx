import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { User, Role, Wallet, Category, Transaction, CategoryType, UserWalletPermission } from '../types.ts';

// --- MOCK DATA (Akan digantikan oleh API calls) ---
const MOCK_USERS: User[] = [
    { id: 1, name: 'Akbar Gumelar', username: 'admin', password: 'password123', role: Role.ADMIN },
    { id: 2, name: 'Viewer A', username: 'viewer_a', password: 'password123', role: Role.VIEWER },
    { id: 3, name: 'Viewer B', username: 'viewer_b', password: 'password123', role: Role.VIEWER },
];

const MOCK_WALLETS: Wallet[] = [
    { id: 1, name: 'Cash', icon: 'Wallet', initialBalance: 500000 },
    { id: 2, name: 'Bank Mandiri', icon: 'Landmark', initialBalance: 5000000 },
    { id: 3, name: 'GoPay', icon: 'Smartphone', initialBalance: 250000 },
];

const MOCK_CATEGORIES: Category[] = [
    { id: 1, name: 'Gaji', type: CategoryType.INCOME, icon: 'DollarSign' },
    { id: 2, name: 'Hadiah', type: CategoryType.INCOME, icon: 'Gift' },
    { id: 3, name: 'Makanan & Minuman', type: CategoryType.EXPENSE, icon: 'Utensils' },
    { id: 4, name: 'Transportasi', type: CategoryType.EXPENSE, icon: 'Car' },
    { id: 5, name: 'Tagihan', type: CategoryType.EXPENSE, icon: 'FileText' },
    { id: 6, name: 'Belanja', type: CategoryType.EXPENSE, icon: 'ShoppingCart' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 1, date: '2024-07-25', amount: 7500000, type: CategoryType.INCOME, description: 'Gaji Juli', categoryId: 1, walletId: 2, userId: 1 },
    { id: 2, date: '2024-07-25', amount: 50000, type: CategoryType.EXPENSE, description: 'Makan siang', categoryId: 3, walletId: 1, userId: 1 },
    { id: 3, date: '2024-07-26', amount: 150000, type: CategoryType.EXPENSE, description: 'Bensin', categoryId: 4, walletId: 3, userId: 1 },
    { id: 4, date: '2024-07-27', amount: 550000, type: CategoryType.EXPENSE, description: 'Tagihan Listrik', categoryId: 5, walletId: 2, userId: 1 },
];

const MOCK_PERMISSIONS: UserWalletPermission[] = [
    { userId: 2, walletId: 1 }, // viewer_a can see Cash
    { userId: 3, walletId: 2 }, // viewer_b can see Bank Mandiri
    { userId: 3, walletId: 3 }, // viewer_b can see GoPay
];

// --- CONTEXT ---
type ActiveView = 'dashboard' | 'transactions' | 'management' | 'profile';

interface AppContextType {
    currentUser: User | null;
    activeView: ActiveView;
    users: User[];
    wallets: Wallet[];
    transactions: Transaction[];
    categories: Category[];
    permissions: UserWalletPermission[];
    login: (username: string, password?: string) => Promise<boolean>;
    logout: () => void;
    setActiveView: (view: ActiveView) => void;
    addTransaction: (transactionData: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
    getWalletById: (id: number) => Wallet | undefined;
    getCategoryById: (id: number) => Category | undefined;
    calculateWalletBalance: (walletId: number) => number;
    updateProfile: (user: User) => void;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: number) => void;
    addWallet: (wallet: Omit<Wallet, 'id'>) => void;
    updateWallet: (wallet: Wallet) => void;
    deleteWallet: (walletId: number) => void;
    addCategory: (category: Omit<Category, 'id'>) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (categoryId: number) => void;
    updateUserPermissions: (userId: number, walletIds: number[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('dashboard');
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [wallets, setWallets] = useState<Wallet[]>(MOCK_WALLETS);
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [permissions, setPermissions] = useState<UserWalletPermission[]>(MOCK_PERMISSIONS);

    // Login/Logout and View Management
    const login = useCallback(async (username: string, password?: string): Promise<boolean> => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            setActiveView('dashboard');
            return true;
        }
        return false;
    }, [users]);

    const logout = useCallback(() => {
        setCurrentUser(null);
        setActiveView('dashboard');
    }, []);

    // CRUD Operations (Mocked)
    const addTransaction = useCallback(async (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
        if (!currentUser) return;
        const newTransaction: Transaction = {
            ...transactionData,
            id: Date.now(),
            userId: currentUser.id,
        };
        setTransactions(prev => [newTransaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, [currentUser]);

    const updateProfile = (updatedUser: User) => {
        if (!currentUser) return;
        // Update user in the main users list
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        // Update the currently logged-in user state
        setCurrentUser(updatedUser);
        alert('Profile updated successfully!');
    };
    
    // User Management
    const addUser = (userData: Omit<User, 'id'>) => {
        const newUser: User = { ...userData, id: Date.now() };
        setUsers(prev => [...prev, newUser]);
    };
    const updateUser = (updatedUser: User) => setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    const deleteUser = (userId: number) => setUsers(prev => prev.filter(u => u.id !== userId));

    // Wallet Management
    const addWallet = (walletData: Omit<Wallet, 'id'>) => {
        const newWallet: Wallet = { ...walletData, icon: 'Wallet', id: Date.now() };
        setWallets(prev => [...prev, newWallet]);
    };
    const updateWallet = (updatedWallet: Wallet) => setWallets(prev => prev.map(w => w.id === updatedWallet.id ? updatedWallet : w));
    const deleteWallet = (walletId: number) => setWallets(prev => prev.filter(w => w.id !== walletId));

    // Category Management
    const addCategory = (categoryData: Omit<Category, 'id'>) => {
        const newCategory: Category = { ...categoryData, id: Date.now() };
        setCategories(prev => [...prev, newCategory]);
    };
    const updateCategory = (updatedCategory: Category) => setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    const deleteCategory = (categoryId: number) => setCategories(prev => prev.filter(c => c.id !== categoryId));

    // Permission Management
    const updateUserPermissions = (userId: number, walletIds: number[]) => {
        // Remove old permissions for the user
        const otherUserPermissions = permissions.filter(p => p.userId !== userId);
        // Create new permissions
        const newUserPermissions = walletIds.map(walletId => ({ userId, walletId }));
        // Set new state
        setPermissions([...otherUserPermissions, ...newUserPermissions]);
    };

    // Data Getters and Calculators
    const getWalletById = useCallback((id: number) => wallets.find(w => w.id === id), [wallets]);
    const getCategoryById = useCallback((id: number) => categories.find(c => c.id === id), [categories]);
    
    const calculateWalletBalance = useCallback((walletId: number): number => {
        const wallet = getWalletById(walletId);
        if (!wallet) return 0;
        const balance = transactions
            .filter(t => t.walletId === walletId)
            .reduce((acc, t) => {
                return t.type === CategoryType.INCOME ? acc + t.amount : acc - t.amount;
            }, wallet.initialBalance);
        return balance;
    }, [transactions, getWalletById]);

    const value: AppContextType = {
        currentUser, activeView, users, wallets, transactions, categories, permissions,
        login, logout, setActiveView, addTransaction, getWalletById, getCategoryById,
        calculateWalletBalance, updateProfile, addUser, updateUser, deleteUser,
        addWallet, updateWallet, deleteWallet, addCategory, updateCategory, deleteCategory,
        updateUserPermissions,
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
