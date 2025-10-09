
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { CategoryType } from '../types.ts';
import Icon from './ui/Icon.tsx';

interface TransactionFormProps {
    onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
    const { wallets, categories, addTransaction } = useAppContext();
    const [type, setType] = useState<CategoryType>(CategoryType.EXPENSE);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categoryId, setCategoryId] = useState('');
    const [walletId, setWalletId] = useState('');
    const [description, setDescription] = useState('');
    
    const filteredCategories = categories.filter(c => c.type === type);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !categoryId || !walletId) {
            alert('Please fill all required fields');
            return;
        }

        addTransaction({
            date,
            amount: parseFloat(amount),
            type,
            description,
            categoryId: parseInt(categoryId),
            walletId: parseInt(walletId)
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
            <div className="bg-base-100 rounded-xl shadow-lg p-6 w-full max-w-lg relative m-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <Icon name="X" size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-neutral">Add New Transaction</h2>
                
                <div className="flex border border-gray-300 rounded-lg p-1 mb-4">
                    <button 
                        onClick={() => setType(CategoryType.EXPENSE)}
                        className={`w-1/2 p-2 rounded-md font-semibold transition ${type === CategoryType.EXPENSE ? 'bg-error text-white' : 'hover:bg-red-50'}`}
                    >
                        Expense
                    </button>
                    <button 
                        onClick={() => setType(CategoryType.INCOME)}
                        className={`w-1/2 p-2 rounded-md font-semibold transition ${type === CategoryType.INCOME ? 'bg-success text-white' : 'hover:bg-green-50'}`}
                    >
                        Income
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                            <option value="" disabled>Select a category</option>
                            {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Wallet</label>
                        <select value={walletId} onChange={e => setWalletId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                           <option value="" disabled>Select a wallet</option>
                            {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-base-200 text-neutral font-bold py-2 px-4 rounded-md hover:bg-base-300">Cancel</button>
                        <button type="submit" className="bg-primary text-primary-content font-bold py-2 px-4 rounded-md hover:bg-primary-focus">Save Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;