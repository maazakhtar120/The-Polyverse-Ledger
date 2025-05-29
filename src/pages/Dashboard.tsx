import CreditScoreViewer from '../components/CreditScoreViewer';

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, Network } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvoices: 0,
    totalBlockchains: 0,
    averageScore: 0
  });

  useEffect(() => {
    // In a real app, fetch these stats from the API
    setStats({
      totalUsers: 156,
      totalInvoices: 892,
      totalBlockchains: 5,
      averageScore: 720
    });
  }, []);

  const cards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Invoices', value: stats.totalInvoices, icon: FileText, color: 'bg-green-500' },
    { title: 'Connected Blockchains', value: stats.totalBlockchains, icon: Network, color: 'bg-purple-500' },
    { title: 'Average Credit Score', value: stats.averageScore, icon: BarChart3, color: 'bg-yellow-500' }
  ];

  return (
    
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Monitor your blockchain credit system</p>
        {/* 👇 Show the user's credit score */}
    <CreditScoreViewer />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <div key={title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-sm text-gray-500">From Ethereum Network</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 minutes ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;