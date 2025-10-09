export enum Role {
    ADMIN = 'admin',
    VIEWER = 'viewer',
}

export interface User {
    id: number;
    name: string;
    username: string;
    password?: string; // Added for mock authentication
    role: Role;
}

export interface Wallet {
    id: number;
    name: string;
    icon: string; // Icon component name from lucide-react
    initialBalance: number;
}

export enum CategoryType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export interface Category {
    id: number;
    name: string;
    type: CategoryType;
    icon: string; // Icon component name from lucide-react
}

export interface Transaction {
    id: number;
    date: string; // ISO string format
    amount: number;
    type: CategoryType;
    description: string;
    categoryId: number;
    walletId: number;
    userId: number; // The admin who created it
    receiptImageUrl?: string; // Optional field for receipt photo
}

export interface UserWalletPermission {
    userId: number;
    walletId: number;
}
