import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { User, Role, Wallet, Category, Transaction, CategoryType, UserWalletPermission } from '../types.ts';

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
    addTransaction: (transactionData: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
    getWalletById: (id: number) => Wallet | undefined;
    getCategoryById: (id: number) => Category | undefined;
    calculateWalletBalance: (walletId: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:3001/api'; // Ganti dengan URL produksi Anda nanti

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State akan diisi dari API
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    
    // State untuk user tetap di frontend untuk sementara
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('dashboard');

    // Mengambil data awal saat aplikasi dimuat
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Di aplikasi nyata, endpoint ini akan mengambil data berdasarkan user yang login
                // FIX: The Promise.all call was only fetching one of three resources, causing a
                // destructuring error because it expected three results. Uncommented the fetches
                // for wallets and categories to resolve the error and enable core app functionality.
                const [transactionsRes, walletsRes, categoriesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/transactions`), // Ganti dengan endpoint yang sesuai
                    fetch(`${API_BASE_URL}/wallets`), 
                    fetch(`${API_BASE_URL}/categories`),
                ]);

                const transactionsData = await transactionsRes.json();
                const walletsData = await walletsRes.json();
                const categoriesData = await categoriesRes.json();
                
                setTransactions(transactionsData);
                setWallets(walletsData);
                setCategories(categoriesData);

            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            }
        };

        if (currentUser) {
            fetchData();
        }
    }, [currentUser]);

    // Fungsi login masih mock untuk saat ini
    const login = useCallback(async (username: string, password?: string): Promise<boolean> => {
        // TODO: Ganti ini dengan panggilan API ke endpoint /api/login
        const MOCK_USERS: User[] = [
            { id: 1, username: 'admin', password: 'password123', role: Role.ADMIN },
            { id: 2, username: 'viewer_a', password: 'password123', role: Role.VIEWER },
            { id: 3, username: 'viewer_b', password: 'password123', role: Role.VIEWER },
        ];
        const user = MOCK_USERS.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    }, []);


    const logout = useCallback(() => {
        setCurrentUser(null);
        setActiveView('dashboard');
    }, []);

    const addTransaction = useCallback(async (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
        if (!currentUser) return;
        try {
            const response = await fetch(`${API_BASE_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                throw new Error('Failed to add transaction');
            }

            const newTransaction = await response.json();
            // Perbarui state lokal dengan data dari server
            setTransactions(prev => [newTransaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    }, [currentUser]);

    const getWalletById = useCallback((id: number) => wallets.find(w => w.id === id), [wallets]);
    const getCategoryById = useCallback((id: number) => categories.find(c => c.id === id), [categories]);
    
    // Fungsi ini perlu penyesuaian karena data wallet dan initial balance belum dari API
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
        currentUser,
        activeView,
        wallets, // Ini perlu diisi dari API
        transactions,
        categories, // Ini perlu diisi dari API
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