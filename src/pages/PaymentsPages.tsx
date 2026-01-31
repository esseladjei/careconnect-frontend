import React, { useState } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 

// --- Mock Data ---
interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  invoiceLink: string;
}

const mockPayments: PaymentRecord[] = [
  { id: 'TXN8732', date: '2025-11-20', description: 'Cardiology Consultation (Dr. Reed)', amount: 150.00, status: 'Completed', invoiceLink: '#' },
  { id: 'TXN8731', date: '2025-10-15', description: 'Subscription Renewal (Pro)', amount: 29.99, status: 'Completed', invoiceLink: '#' },
  { id: 'TXN8730', date: '2025-09-01', description: 'Dermatology Appointment (Dr. Cho)', amount: 80.00, status: 'Completed', invoiceLink: '#' },
  { id: 'TXN8729', date: '2025-08-05', description: 'Subscription Renewal (Pro)', amount: 29.99, status: 'Failed', invoiceLink: '#' },
  { id: 'TXN8728', date: '2025-07-10', description: 'Orthopedics Follow-up', amount: 120.00, status: 'Completed', invoiceLink: '#' },
];

// --- Status Styling Helper ---
const getStatusClasses = (status: PaymentRecord['status']) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


const PaymentHistoryPage: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [timeframe, setTimeframe] = useState('Last 6 Months');
  
  const filteredPayments = mockPayments.filter(p => filter === 'All' || p.status === filter);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> 
      
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment History & Records</h1>

        {/* --- Filter and Action Bar --- */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          
          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            
            {/* Timeframe Filter */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500"
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
          </div>
          
          {/* Export Button */}
          <button
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Export to CSV
          </button>
        </div>

        {/* --- Payment Records Table --- */}
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${record.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={record.invoiceLink} className="text-blue-600 hover:text-blue-900">
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPayments.length === 0 && (
             <div className="p-6 text-center text-gray-500">
                No payments found matching the current filters.
             </div>
          )}
        </div>
        
        {/* Pagination Placeholder */}
        <div className="flex justify-center mt-8 p-4">
            <span className="text-sm text-gray-500">Showing 1 to {filteredPayments.length} of {mockPayments.length} results</span>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PaymentHistoryPage;