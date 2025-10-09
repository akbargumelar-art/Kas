
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-end sm:items-center z-40">
            <div className="bg-base-100 rounded-t-2xl sm:rounded-xl shadow-lg p-6 w-full max-w-lg relative m-0 sm:m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-base-content">Tambah Transaksi</h2>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
                        <Icon name="X" size={20} />
                    </button>
                </div>
                
                <div role="tablist" className="tabs tabs-boxed grid-cols-2 mb-4">
                    <a role="tab"
                        onClick={() => setType(CategoryType.EXPENSE)}
                        className={`tab ${type === CategoryType.EXPENSE ? 'tab-active !bg-error text-white' : ''}`}
                    >
                        Pengeluaran
                    </a>
                    <a role="tab"
                        onClick={() => setType(CategoryType.INCOME)}
                        className={`tab ${type === CategoryType.INCOME ? 'tab-active !bg-success text-white' : ''}`}
                    >
                        Pemasukan
                    </a>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                     <label className="form-control w-full">
                        <div className="label"><span className="label-text">Jumlah</span></div>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Rp 0" className="input input-bordered w-full" required />
                    </label>
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text">Tanggal</span></div>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input input-bordered w-full" required />
                    </label>
                     <label className="form-control w-full">
                        <div className="label"><span className="label-text">Kategori</span></div>
                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="select select-bordered" required>
                            <option value="" disabled>Pilih kategori</option>
                            {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </label>
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text">Dompet</span></div>
                        <select value={walletId} onChange={e => setWalletId(e.target.value)} className="select select-bordered" required>
                           <option value="" disabled>Pilih dompet</option>
                            {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                    </label>
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text">Deskripsi</span></div>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Contoh: Makan siang" className="textarea textarea-bordered"></textarea>
                    </label>
                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full">Simpan Transaksi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;