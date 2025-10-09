
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/AppContext.tsx';
import { CategoryType, Transaction, Category } from '../../types.ts';

const COLORS = ['#0ea5e9', '#f97316', '#eab308', '#8b5cf6', '#d946ef', '#14b8a6'];

const ExpensePieChart: React.FC = () => {
    const { transactions, categories, getCategoryById } = useAppContext();

    const processData = (transactions: Transaction[], categories: Category[]) => {
        const expenseData: { [key: string]: number } = {};
        const expenseCategories = categories.filter(c => c.type === CategoryType.EXPENSE);

        expenseCategories.forEach(cat => {
            expenseData[cat.name] = 0;
        });

        transactions
            .filter(t => t.type === CategoryType.EXPENSE)
            .forEach(transaction => {
                const category = getCategoryById(transaction.categoryId);
                if (category) {
                    expenseData[category.name] += transaction.amount;
                }
            });

        return Object.entries(expenseData)
            .map(([name, value]) => ({ name, value }))
            .filter(d => d.value > 0);
    };

    const data = processData(transactions, categories);
    
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No expense data for this period.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value as number)}/>
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ExpensePieChart;