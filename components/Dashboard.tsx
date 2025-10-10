import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { CategoryType, Role, Transaction, Wallet } from '../types.ts';
import Icon from './ui/Icon.tsx';
import IncomeExpenseBarChart from './charts/IncomeExpenseBarChart.tsx';
import ExpensePieChart from './charts/ExpensePieChart.tsx';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const DashboardHeader: React.FC<{ totalBalance: number }> = ({ totalBalance }) => {
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    return (
        <div className="flex justify-between items-start text-base-content mb-4">
            <div>
                <p className="text-2xl font-bold flex items-center gap-2">
                    {isBalanceVisible ? formatCurrency(totalBalance) : 'Rp ••••••••'}
                    <button onClick={() => setIsBalanceVisible(!isBalanceVisible)} className="btn btn-ghost btn-xs btn-circle">
                        <Icon name={isBalanceVisible ? 'Eye' : 'EyeOff'} size={16} />
                    </button>
                </p>
                <div className="text-xs text-base-content/70 flex items-center gap-1">
                    <span>Jumlah saldo</span>
                    <div className="tooltip" data-tip="Total saldo dari semua dompet Anda">
                        <Icon name="HelpCircle" size={12} />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button className="btn btn-ghost btn-sm btn-circle"><Icon name="Search" size={20} /></button>
                <button className="btn btn-ghost btn-sm btn-circle"><Icon name="Bell" size={20} /></button>
            </div>
        </div>
    );
};

const WalletListCard: React.FC<{ wallets: Wallet[] }> = ({ wallets }) => {
    const { calculateWalletBalance } = useAppContext();
    const walletIcons = {
        'Cash': { color: 'bg-orange-500' },
        'BCA': { color: 'bg-sky-500' },
        'SeaBank': { color: 'bg-yellow-400' },
    };
    return (
        <div className="bg-base-100 rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-base">Dompet Saya</h2>
                <a href="#" className="text-sm font-semibold text-success">Lihat semua</a>
            </div>
            <div className="space-y-3">
                 {wallets.length > 0 ? wallets.map(wallet => (
                    <div key={wallet.id} className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${walletIcons[wallet.name]?.color || 'bg-gray-500'}`}>
                             <Icon name={wallet.icon as any} size={20} className="text-white"/>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{wallet.name}</p>
                        </div>
                         <p className="font-bold text-sm">{formatCurrency(calculateWalletBalance(wallet.id))}</p>
                    </div>
                )) : (
                     <div className="h-full flex flex-col items-center justify-center text-center text-base-content/60 py-4">
                        <Icon name="Wallet" size={32} className="mb-2" />
                        <p className="text-sm font-semibold">Tidak ada dompet</p>
                    </div>
                )}
            </div>
        </div>
    )
};

const MonthlyReportCard: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
     const { totalIncome, totalExpense } = useMemo(() => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        
        const monthlyTransactions = transactions.filter(t => t.date >= firstDayOfMonth);

        const totalIncome = monthlyTransactions.filter(t => t.type === CategoryType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = monthlyTransactions.filter(t => t.type === CategoryType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome, totalExpense };
    }, [transactions]);
    
    const total = totalIncome + totalExpense;
    const expensePercentage = total > 0 ? (totalExpense / total) * 100 : 0;
    
    return (
        <div className="bg-base-100 rounded-xl shadow p-4">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-base">Laporan bulan ini</h2>
                <a href="#" className="text-sm font-semibold text-success">Melihat laporan-laporan</a>
            </div>
            
            <div className="flex justify-between text-xs mb-2">
                <div>
                    <p>Total pengeluaran</p>
                    <p className="font-bold text-base">{formatCurrency(totalExpense)}</p>
                </div>
                <div className="text-right">
                    <p>Total pendapatan</p>
                    <p className="font-bold text-base">{formatCurrency(totalIncome)}</p>
                </div>
            </div>

            <div className="w-full bg-success rounded-full h-2.5 mb-4">
              <div className="bg-error h-2.5 rounded-full" style={{width: `${expensePercentage}%`}}></div>
            </div>
            
            <div className="flex-1 my-4 flex items-center justify-center min-h-[150px] bg-base-200 border-2 border-dashed border-base-300 rounded-lg">
                {transactions.length > 0 ? (
                    <div className="w-full h-full p-2">
                        <IncomeExpenseBarChart transactions={transactions} />
                    </div>
                ) : (
                    <div className="text-center text-base-content/60">
                        <p className="text-sm font-semibold">Masukkan transaksi untuk melihat laporan</p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-2">
                <button className="btn btn-ghost btn-xs btn-circle"><Icon name="ChevronLeft" /></button>
                <div className="text-xs text-base-content/70">
                    Laporan tren
                </div>
                <button className="btn btn-ghost btn-xs btn-circle"><Icon name="ChevronRight" /></button>
            </div>
        </div>
    );
}

const TopExpensesCard: React.FC = () => {
    const { transactions } = useAppContext();
    const [activeTab, setActiveTab] = useState('Bulan');

    const filteredTransactions = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (activeTab === 'Bulan') {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            return transactions.filter(t => new Date(t.date) >= firstDayOfMonth);
        } else { // Minggu
            const dayOfWeek = today.getDay();
            const firstDayOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
            return transactions.filter(t => new Date(t.date) >= firstDayOfWeek);
        }
    }, [transactions, activeTab]);
    
    const hasExpenses = useMemo(() => filteredTransactions.some(t => t.type === CategoryType.EXPENSE), [filteredTransactions]);

    return (
         <div className="bg-base-100 rounded-xl shadow p-4">
             <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-base">Pengeluaran teratas</h2>
                <a href="#" className="text-sm font-semibold text-success">Lihat detailnya</a>
            </div>
            <div role="tablist" className="tabs tabs-boxed tabs-sm bg-base-200">
                <a role="tab" className={`tab ${activeTab === 'Minggu' ? 'tab-active' : ''}`} onClick={() => setActiveTab('Minggu')}>Minggu</a>
                <a role="tab" className={`tab ${activeTab === 'Bulan' ? 'tab-active' : ''}`} onClick={() => setActiveTab('Bulan')}>Bulan</a>
            </div>
            <div className="flex-1 mt-4 flex flex-col items-center justify-center min-h-[200px]">
                {hasExpenses ? (
                    <ExpensePieChart transactions={filteredTransactions} />
                ) : (
                   <p className="text-sm text-base-content/60 p-4 text-center">Kategori pengeluaran teratas akan muncul di sini 🙌</p>
                )}
            </div>
        </div>
    );
};

const RecentTransactionsCard: React.FC = () => {
    const { transactions, getCategoryById, getWalletById } = useAppContext();
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="bg-base-100 rounded-xl shadow p-4">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-base">Transaksi terkini</h2>
                <a href="#" className="text-sm font-semibold text-success">Lihat semua</a>
            </div>
             <div className="space-y-3">
                {recentTransactions.length > 0 ? recentTransactions.map(t => {
                    const category = getCategoryById(t.categoryId);
                    const wallet = getWalletById(t.walletId);
                    return (
                        <div key={t.id} className="flex items-center gap-3">
                            <div className="p-3 bg-base-200 rounded-lg">
                                <Icon name={category?.icon as any || 'HelpCircle'} size={20} className="text-base-content" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{t.description || category?.name}</p>
                                <p className="text-xs text-base-content/60">{new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {wallet?.name}</p>
                            </div>
                            <p className={`font-bold text-sm ${t.type === CategoryType.INCOME ? 'text-success' : 'text-error'}`}>
                                {t.type === CategoryType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                            </p>
                        </div>
                    );
                }) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-center text-base-content/60 p-4 min-h-[100px]">
                        <p className="text-sm">Transaksi yang ditambahkan akan muncul di sini 🙌</p>
                    </div>
                )}
            </div>
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

    const totalBalance = useMemo(() => {
        return permittedWallets.reduce((acc, wallet) => acc + calculateWalletBalance(wallet.id), 0);
    }, [permittedWallets, calculateWalletBalance]);

    return (
        <div className="space-y-4">
            <DashboardHeader totalBalance={totalBalance} />
            <WalletListCard wallets={permittedWallets} />
            <MonthlyReportCard transactions={transactions} />
            <TopExpensesCard />
            <RecentTransactionsCard />
        </div>
    );
};

export default Dashboard;