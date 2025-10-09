import React, { useState, useEffect } from 'react';
import { icons } from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import { Category, CategoryType } from '../types.ts';
import Icon from './ui/Icon.tsx';

interface CategoryFormProps {
    category: Category | null;
    onClose: () => void;
}

const iconNames = Object.keys(icons) as (keyof typeof icons)[];

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onClose }) => {
    const { addCategory, updateCategory } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        type: CategoryType.EXPENSE,
        icon: 'HelpCircle',
    });
    
    const isEditing = category !== null;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                name: category.name,
                type: category.type,
                icon: category.icon,
            });
        }
    }, [category, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            updateCategory({ ...category, ...formData });
        } else {
            addCategory(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
            <div className="bg-base-100 rounded-xl shadow-lg p-6 w-full max-w-lg relative m-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <Icon name="X" size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-neutral">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                            <option value={CategoryType.EXPENSE}>Expense</option>
                            <option value={CategoryType.INCOME}>Income</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Icon</label>
                        <select name="icon" value={formData.icon} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                            {iconNames.map(iconName => (
                                <option key={iconName} value={iconName}>{iconName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Category</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
