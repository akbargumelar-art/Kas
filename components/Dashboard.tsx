
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { CategoryType } from '../types';
import IncomeExpenseBarChart from './charts/IncomeExpenseBarChart';
import ExpensePieChart from './charts/ExpensePieChart';
import Icon from './ui/Icon';

const Dashboard: React.FC = () => {
    const { wallets, transactions, calculateWalletBalance } = useAppContext();

    const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
        let totalBalance = 0;
        wallets.forEach(wallet => {
            totalBalance += calculateWalletBalance(wallet.id);
        });

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyTransactions = transactions.filter(t => new Date(t.date) >= firstDayOfMonth);

        const totalIncome = monthlyTransactions
            .filter(t => t.type === CategoryType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = monthlyTransactions
            .filter(t => t.type === CategoryType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, totalIncome, totalExpense };
    }, [wallets, transactions, calculateWalletBalance]);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral">Dashboard</h1>

            {/* Stats Cards */}
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-base-100 p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold text-neutral mb-4">Monthly Overview</h2>
                    <div style={{ height: '300px' }}>
                       <IncomeExpenseBarChart />
                    </div>
                </div>
                <div className="lg:col-span-2 bg-base-100 p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold text-neutral mb-4">Expense Breakdown</h2>
                     <div style={{ height: '300px' }}>
                       <ExpensePieChart />
                    </div>
                </div>
            </div>

            {/* Wallet Balances */}
            <div className="bg-base-100 p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold text-neutral mb-4">Wallet Balances</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {wallets.map(wallet => (
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
