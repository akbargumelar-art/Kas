import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { CategoryType, Role, Transaction } from '../types.ts';
import IncomeExpenseBarChart from './charts/IncomeExpenseBarChart.tsx';
import CategoryBreakdownChart from './charts/CategoryBreakdownChart.tsx';
import Icon from './ui/Icon.tsx';

const RecentTransactions: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const { getCategoryById, getWalletById } = useAppContext();

    const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

    if (transactions.length === 0) {
        return <p className="text-center text-secondary py-4 h-full flex items-center justify-center">No transactions match filters.</p>;
    }

    return (
        <div className="space-y-3">
            {transactions.slice(0, 5).map(t => {
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
    
    const [selectedWalletId, setSelectedWalletId] = useState<string>('all');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: new Date().toISOString().split('T')[0] // today
    });

    const permittedWallets = useMemo(() => {
        if (currentUser?.role === Role.ADMIN) return wallets;
        const permittedIds = new Set(permissions.filter(p => p.userId === currentUser?.id).map(p => p.walletId));
        return wallets.filter(w => permittedIds.has(w.id));
    }, [wallets, currentUser, permissions]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const walletMatch = selectedWalletId === 'all' || t.walletId === parseInt(selectedWalletId);
            const permittedWalletIds = new Set(permittedWallets.map(w => w.id));
            const permissionMatch = currentUser?.role === Role.ADMIN || permittedWalletIds.has(t.walletId);
            const date = new Date(t.date);
            const startDateMatch = !dateRange.start || date >= new Date(dateRange.start);
            const endDateMatch = !dateRange.end || date <= new Date(new Date(dateRange.end).setHours(23, 59, 59, 999));

            return walletMatch && permissionMatch && startDateMatch && endDateMatch;
        });
    }, [transactions, selectedWalletId, permittedWallets, currentUser, dateRange]);


    const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
        const walletsToCalculate = selectedWalletId === 'all' 
            ? permittedWallets 
            : permittedWallets.filter(w => w.id === parseInt(selectedWalletId));
        
        let totalBalance = walletsToCalculate.reduce((acc, wallet) => {
            const balance = transactions
                .filter(t => t.walletId === wallet.id)
                .reduce((bal, t) => t.type === CategoryType.INCOME ? bal + t.amount : bal - t.amount, wallet.initialBalance);
            return acc + balance;
        }, 0);
        
        const totalIncome = filteredTransactions.filter(t => t.type === CategoryType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = filteredTransactions.filter(t => t.type === CategoryType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, totalIncome, totalExpense };
    }, [filteredTransactions, permittedWallets, selectedWalletId, transactions]);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral">Dashboard</h1>

             <div className="bg-base-100 p-4 rounded-xl shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Filter by Wallet</span></label>
                         <select value={selectedWalletId} onChange={e => setSelectedWalletId(e.target.value)} className="select select-bordered w-full">
                            <option value="all">All Wallets</option>
                            {permittedWallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                    </div>
                     <div className="form-control">
                        <label className="label"><span className="label-text">Start Date</span></label>
                        <input type="date" name="start" value={dateRange.start} onChange={handleDateChange} className="input input-bordered w-full" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">End Date</span></label>
                        <input type="date" name="end" value={dateRange.end} onChange={handleDateChange} className="input input-bordered w-full" />
                    </div>
                </div>
            </div>

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
                        <p className="text-sm text-secondary">Income</p>
                        <p className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</p>
                    </div>
                </div>
                 <div className="bg-base-100 p-6 rounded-xl shadow flex items-center">
                    <div className="bg-red-100 p-3 rounded-full mr-4"><Icon name="TrendingDown" className="text-red-500" /></div>
                    <div>
                        <p className="text-sm text-secondary">Expense</p>
                        <p className="text-2xl font-bold text-error">{formatCurrency(totalExpense)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-base-100 p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold text-neutral mb-4">Category Breakdown</h2>
                    <div style={{ height: '350px' }}>
                       <CategoryBreakdownChart transactions={filteredTransactions} />
                    </div>
                </div>
                <div className="lg:col-span-2 bg-base-100 p-6 rounded-xl shadow">
                     <h2 className="text-xl font-semibold text-neutral mb-4">Recent Transactions</h2>
                     <RecentTransactions transactions={filteredTransactions} />
                </div>
            </div>

             <div className="bg-base-100 p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold text-neutral mb-4">Monthly Overview</h2>
                <div style={{ height: '300px' }}>
                    <IncomeExpenseBarChart transactions={filteredTransactions} />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
