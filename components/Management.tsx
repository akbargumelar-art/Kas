
import React from 'react';
import Icon from './ui/Icon';

const Management: React.FC = () => {
    // In a real application, this would be a real, secure endpoint.
    const apiEndpoint = "https://your-website.com/api/v1/transactions/whatsapp";

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral">Management</h1>

            <div className="bg-base-100 p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold text-neutral mb-4 flex items-center gap-2">
                    <Icon name="Webhook" />
                    WhatsApp (n8n) Integration
                </h2>
                <p className="text-secondary mb-4">
                    Use the following endpoint in your n8n workflow to automatically create expense transactions from WhatsApp receipts.
                    The workflow should send a POST request with a JSON body.
                </p>
                
                <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm break-all mb-4">
                    {apiEndpoint}
                </div>

                <h3 className="font-semibold text-neutral mb-2">Expected JSON format:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>
{`{
  "total": 15.50,
  "date": "2024-08-01",
  "merchant": "Local Coffee Shop"
}`}
                    </code>
                </pre>
                <p className="text-sm text-secondary mt-4">
                    Transactions created via this endpoint will be automatically assigned to the 'Cash' wallet and the 'Makanan' category by default.
                </p>
            </div>

            <div className="bg-base-100 p-6 rounded-xl shadow">
                 <h2 className="text-xl font-semibold text-neutral mb-4">User & Data Management</h2>
                 <p className="text-secondary">
                    Management interfaces for Users, Wallets, and Categories would be implemented here. This includes creating new users, assigning wallet permissions to viewers, and managing categories.
                 </p>
                 {/* Placeholder for future tabs */}
                 <div className="mt-4 flex gap-4 text-secondary">
                     <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                        <Icon name="Users"/><span>Manage Users</span>
                     </div>
                      <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                        <Icon name="WalletCards"/><span>Manage Wallets</span>
                     </div>
                      <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                        <Icon name="Tags"/><span>Manage Categories</span>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default Management;
