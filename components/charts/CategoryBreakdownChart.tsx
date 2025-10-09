import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/AppContext.tsx';
import { CategoryType, Transaction } from '../../types.ts';

interface ChartProps {
    transactions: Transaction[];
}

const CategoryBreakdownChart: React.FC<ChartProps> = ({ transactions }) => {
    const { getCategoryById } = useAppContext();

    const processData = (transactions: Transaction[]) => {
        const dataByCategory: { [key: string]: { name: string; income: number; expense: number } } = {};

        transactions.forEach(transaction => {
            const category = getCategoryById(transaction.categoryId);
            if (!category) return;
            
            if (!dataByCategory[category.name]) {
                dataByCategory[category.name] = { name: category.name, income: 0, expense: 0 };
            }

            if (transaction.type === CategoryType.INCOME) {
                dataByCategory[category.name].income += transaction.amount;
            } else {
                dataByCategory[category.name].expense += transaction.amount;
            }
        });
        
        return Object.values(dataByCategory).filter(d => d.income > 0 || d.expense > 0);
    };

    const data = processData(transactions);

    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No category data to display.</div>;
    }
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value as number)} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value as number)} />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CategoryBreakdownChart;
