import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Wallet } from '../types.ts';
import Icon from './ui/Icon.tsx';

interface WalletFormProps {
    wallet: Wallet | null;
    onClose: () => void;
}

const WalletForm: React.FC<WalletFormProps> = ({ wallet, onClose }) => {
    const { addWallet, updateWallet } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        initialBalance: '',
    });
    
    const isEditing = wallet !== null;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                name: wallet.name,
                initialBalance: String(wallet.initialBalance),
            });
        }
    }, [wallet, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const walletData = {
            name: formData.name,
            initialBalance: parseFloat(formData.initialBalance),
        };
        if (isEditing) {
            updateWallet({ ...wallet, ...walletData });
        } else {
            addWallet(walletData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
            <div className="bg-base-100 rounded-xl shadow-lg p-6 w-full max-w-lg relative m-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <Icon name="X" size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-neutral">{isEditing ? 'Edit Wallet' : 'Add New Wallet'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Wallet Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Initial Balance</label>
                        <input type="number" name="initialBalance" value={formData.initialBalance} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Wallet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WalletForm;
