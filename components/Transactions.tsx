import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Role, Transaction, CategoryType } from '../types';
import TransactionForm from './TransactionForm';
import Icon from './ui/Icon';

const ReceiptViewerModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={onClose}>
        <div className="relative p-4 bg-white rounded-lg shadow-xl max-w-3xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img src={imageUrl} alt="Transaction Receipt" className="max-w-full max-h-[85vh] object-contain" />
            <button onClick={onClose} className="absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-lg text-gray-800 hover:bg-gray-200">
                <Icon name="X" size={24} />
            </button>
        </div>
    </div>
);

const Transactions: React.FC = () => {
    const { transactions, wallets, categories, getWalletById, getCategoryById, currentUser } = useAppContext();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

    const [filterDate, setFilterDate] = useState('');
    const [filterWallet, setFilterWallet] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const dateMatch = filterDate ? new Date(t.date).toISOString().startsWith(filterDate) : true;
            const walletMatch = filterWallet === 'all' || t.walletId === parseInt(filterWallet);
            const categoryMatch = filterCategory === 'all' || t.categoryId === parseInt(filterCategory);
            return dateMatch && walletMatch && categoryMatch;
        });
    }, [transactions, filterDate, filterWallet, filterCategory]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-neutral">Transactions</h1>
                {currentUser?.role === Role.ADMIN && (
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-primary text-primary-content font-bold py-2 px-4 rounded-md hover:bg-primary-focus flex items-center gap-2"
                    >
                        <Icon name="Plus" size={16} />
                        Add Transaction
                    </button>
                )}
            </div>

            <div className="bg-base-100 p-4 rounded-xl shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <select
                        value={filterWallet}
                        onChange={(e) => setFilterWallet(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        <option value="all">All Wallets</option>
                        {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-base-100 rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-base-200">
                            <tr>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Description</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold">Wallet</th>
                                <th className="p-4 font-semibold text-right">Amount</th>
                                <th className="p-4 font-semibold text-center">Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(t => {
                                const category = getCategoryById(t.categoryId);
                                const wallet = getWalletById(t.walletId);
                                return (
                                <tr key={t.id} className="border-b border-base-200 last:border-b-0">
                                    <td className="p-4">{formatDate(t.date)}</td>
                                    <td className="p-4 text-neutral font-medium">{t.description}</td>
                                    <td className="p-4">
                                        {category && <span className="flex items-center gap-2">
                                            <Icon name={category.icon as any} size={16} /> {category.name}
                                        </span>}
                                    </td>
                                    <td className="p-4">{wallet?.name}</td>
                                    <td className={`p-4 text-right font-bold ${t.type === CategoryType.INCOME ? 'text-success' : 'text-error'}`}>
                                        {t.type === CategoryType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                                    </td>
                                    <td className="p-4 text-center">
                                        {t.receiptImageUrl && (
                                            <button onClick={() => setSelectedReceipt(t.receiptImageUrl!)} className="text-secondary hover:text-primary">
                                                <Icon name="Camera" size={20} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                     {filteredTransactions.length === 0 && <div className="text-center p-8 text-gray-500">No transactions found.</div>}
                </div>
            </div>

            {isFormOpen && <TransactionForm onClose={() => setIsFormOpen(false)} />}
            {selectedReceipt && <ReceiptViewerModal imageUrl={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
        </div>
    );
};

export default Transactions;