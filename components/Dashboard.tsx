import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { CategoryType, Role, Transaction, Wallet } from '../types.ts';
import IncomeExpenseBarChart from './charts/IncomeExpenseBarChart.tsx';
import Icon from './ui/Icon.tsx';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const DashboardHeader: React.FC<{ totalBalance: number }> = ({ totalBalance }) => {
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    return (
        <div className="p-4 bg-base-100 text-base-content rounded-b-2xl">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <p className="text-sm text-gray-400 flex items-center">
                        Jumlah saldo
                        <Icon name="HelpCircle" size={14} className="ml-1" />
                    </p>
                    <p className="text-2xl font-bold">
                        {isBalanceVisible ? formatCurrency(totalBalance) : 'Rp ••••••••'}
                    </p>
                </div>
                <div>
                    <button onClick={() => setIsBalanceVisible(!isBalanceVisible)} className="btn btn-ghost btn-sm btn-circle">
                        <Icon name={isBalanceVisible ? 'Eye' : 'EyeOff'} size={20} />
                    </button>
                    <button className="btn btn-ghost btn-sm btn-circle"><Icon name="Search" size={20} /></button>
                    <button className="btn btn-ghost btn-sm btn-circle"><Icon name="Bell" size={20} /></button>
                </div>
            </div>
        </div>
    );
};

const WalletListCard: React.FC<{ wallets: Wallet[] }> = ({ wallets }) => {
    const { calculateWalletBalance } = useAppContext();
    return (
        <div className="bg-base-100 rounded-2xl p-4 mx-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold">Dompet Saya</h2>
                <a href="#" className="text-sm text-primary">Lihat semua</a>
            </div>
            <div className="space-y-3">
                {wallets.map(wallet => (
                    <div key={wallet.id} className="flex items-center gap-4">
                        <div className="bg-gray-700 p-2 rounded-lg">
                             <Icon name={wallet.icon as any} size={20} className="text-white"/>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{wallet.name}</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(calculateWalletBalance(wallet.id))}</p>
                    </div>
                ))}
            </div>
        </div>
    )
};

const MonthlyReportCard: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
     const { totalIncome, totalExpense } = useMemo(() => {
        const totalIncome = transactions.filter(t => t.type === CategoryType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === CategoryType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome, totalExpense };
    }, [transactions]);
    
    return (
        <div className="bg-base-100 rounded-2xl p-4 mx-4">
             <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold">Laporan bulan ini</h2>
                <a href="#" className="text-sm text-primary">Melihat laporan-laporan</a>
            </div>
            <div className="flex justify-between text-sm mb-2">
                <p>Total pengeluaran</p>
                <p>Total pendapatan</p>
            </div>
             <div className="flex justify-between font-bold mb-2">
                <p className="text-error">{formatCurrency(totalExpense)}</p>
                <p className="text-success">{formatCurrency(totalIncome)}</p>
            </div>
            <progress className="progress progress-error w-1/2" value={totalExpense} max={totalIncome + totalExpense}></progress>
            <progress className="progress progress-success w-1/2" value={totalIncome} max={totalIncome + totalExpense}></progress>
            
            <div className="h-40 my-4 flex items-center justify-center text-gray-500">
                {transactions.length > 0 ? (
                    <IncomeExpenseBarChart transactions={transactions} />
                ) : (
                    <p>Masukkan transaksi untuk melihat laporan</p>
                )}
            </div>
             <div className="text-center text-sm">
                <p className="font-bold">Laporan tren</p>
            </div>
        </div>
    );
}

const TopExpensesCard: React.FC = () => {
    return (
         <div className="bg-base-100 rounded-2xl p-4 mx-4">
             <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold">Pengeluaran teratas</h2>
                <a href="#" className="text-sm text-primary">Lihat detailnya</a>
            </div>
            <div role="tablist" className="tabs tabs-boxed tabs-sm">
                <a role="tab" className="tab">Minggu</a>
                <a role="tab" className="tab tab-active">Bulan</a>
            </div>
            <div className="h-24 flex flex-col items-center justify-center text-center text-gray-500">
                <p>Kategori pengeluaran teratas akan muncul di sini</p>
                <p> 🙌</p>
            </div>
        </div>
    );
};

const RecentTransactionsCard: React.FC = () => {
    return (
        <div className="bg-base-100 rounded-2xl p-4 mx-4">
             <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold">Transaksi terkini</h2>
                <a href="#" className="text-sm text-primary">Lihat semua</a>
            </div>
             <div className="h-24 flex flex-col items-center justify-center text-center text-gray-500">
                <p>Transaksi yang ditambahkan akan muncul di sini</p>
                <p> 🙌</p>
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