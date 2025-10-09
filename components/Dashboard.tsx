
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { CategoryType, Role } from '../types.ts';
import IncomeExpenseBarChart from './charts/IncomeExpenseBarChart.tsx';
import ExpensePieChart from './charts/ExpensePieChart.tsx';
import Icon from './ui/Icon.tsx';

const RecentTransactions: React.FC = () => {
    const { transactions, getCategoryById, getWalletById, currentUser, permissions } = useAppContext();

    const permittedWalletIds = useMemo(() => {
        if (currentUser?.role === Role.ADMIN) return null;
        return new Set(permissions.filter(p => p.userId === currentUser?.id).map(p => p.walletId));
    }, [currentUser, permissions]);

    const displayedTransactions = useMemo(() => {
        const filtered = currentUser?.role === Role.ADMIN
            ? transactions
            : transactions.filter(t => permittedWalletIds!.has(t.walletId));
        return filtered.slice(0, 5); // Show latest 5
    }, [transactions, currentUser, permittedWalletIds]);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

    if (displayedTransactions.length === 0) {
        return <p className="text-center text-secondary py-4">No transactions to display.</p>;
    }

    return (
        <div className="space-y-3">
            {displayedTransactions.map(t => {
                const category = getCategoryById(t.categoryId);
                const wallet = getWalletById(t.walletId);
                const isIncome = t.type === CategoryType.INCOME;
                return (
                    <div key={t.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full bg-opacity-20 ${isIncome ? 'bg-success' : 'bg-error'}`}>
                                <Icon name={category?.icon as any || 'HelpCircle'} size={20} className={isIncome ? 'text-success' : 'text-error'} />
                            </div>
                            <div>
                                <p className="font-semibold text-neutral">{t.description}</p>
                                <p className="text-sm text-secondary">{wallet?.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className={`font-bold ${isIncome ? 'text-success' : 'text-error'}`}>
                                {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
                            </p>
                            <p className="text-sm text-secondary">{formatDate(t.date)}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


const Dashboard: React.FC = () => {
    const { wallets, transactions, calculateWalletBalance, currentUser, permissions } = useAppContext();

    const permittedWallets = useMemo(() => {
        if (currentUser?.role === Role.ADMIN) return wallets;
        const permittedIds = new Set(permissions.filter(p => p.userId === currentUser?.id).map(p => p.walletId));
        return wallets.filter(w => permittedIds.has(w.id));
    }, [wallets, currentUser, permissions]);

    const permittedTransactions = useMemo(() => {
        if (currentUser?.role === Role.ADMIN) return transactions;
        const permittedWalletIds = new Set(permittedWallets.map(w => w.id));
        return transactions.filter(t => permittedWalletIds.has(t.walletId));
    }, [transactions, currentUser, permittedWallets]);

    const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
        let totalBalance = 0;
        permittedWallets.forEach(wallet => {
            totalBalance += calculateWalletBalance(wallet.id);
        });

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyTransactions = permittedTransactions.filter(t => new Date(t.date) >= firstDayOfMonth);

        const totalIncome = monthlyTransactions.filter(t => t.type === CategoryType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = monthlyTransactions.filter(t => t.type === CategoryType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, totalIncome, totalExpense };
    }, [permittedWallets, permittedTransactions, calculateWalletBalance]);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-base-100 p-6 rounded-xl shadow flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4"><Icon name="Wallet" className="text-blue-500" /></div>
                    <div>
                        <p className="text-sm text-secondary">Total Balance</p>
                        <p className="text-2xl font-bold text-neutral">{formatCurrency(totalBalance)}</p>
                    </div>
                </div>
                <div className="bg-base-100 p-6 rounded-xl shadow flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4"><Icon name="TrendingUp" className="text-green-500" /></div>
                    <div>
                        <p className="text-sm text-secondary">This Month's Income</p>
                        <p className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</p>
                    </div>
                </div>
                 <div className="bg-base-100 p-6 rounded-xl shadow flex items-center">
                    <div className="bg-red-100 p-3 rounded-full mr-4"><Icon name="TrendingDown" className="text-red-500" /></div>
                    <div>
                        <p className="text-sm text-secondary">This Month's Expense</p>
                        <p className="text-2xl font-bold text-error">{formatCurrency(totalExpense)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-base-100 p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold text-neutral mb-4">Monthly Overview</h2>
                    <div style={{ height: '300px' }}>
                       <IncomeExpenseBarChart />
                    </div>
                </div>
                <div className="lg:col-span-2 bg-base-100 p-6 rounded-xl shadow">
                     <h2 className="text-xl font-semibold text-neutral mb-4">Recent Transactions</h2>
                     <RecentTransactions />
                </div>
            </div>

            <div className="bg-base-100 p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold text-neutral mb-4">Wallet Balances</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {permittedWallets.map(wallet => (
                        <div key={wallet.id} className="border border-base-300 p-4 rounded-lg">
                            <p className="font-semibold text-neutral">{wallet.name}</p>
                            <p className="text-lg font-bold text-primary">{formatCurrency(calculateWalletBalance(wallet.id))}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
