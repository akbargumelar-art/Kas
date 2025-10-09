
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/AppContext.tsx';
import { CategoryType, Transaction } from '../../types.ts';

const IncomeExpenseBarChart: React.FC = () => {
    const { transactions } = useAppContext();

    const processData = (transactions: Transaction[]) => {
        const dataByMonth: { [key: string]: { name: string; income: number; expense: number } } = {};

        transactions.forEach(transaction => {
            const month = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!dataByMonth[month]) {
                dataByMonth[month] = { name: month, income: 0, expense: 0 };
            }

            if (transaction.type === CategoryType.INCOME) {
                dataByMonth[month].income += transaction.amount;
            } else {
                dataByMonth[month].expense += transaction.amount;
            }
        });

        return Object.values(dataByMonth).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    };

    const data = processData(transactions);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value as number)} />
                <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID').format(value as number)} />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default IncomeExpenseBarChart;