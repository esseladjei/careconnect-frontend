import React from 'react';
// Assuming these components are imported from their respective files
import Navbar from '../components/Navbar';
import DataCard from '../components/DataCard';
import Footer from '../components/Footer';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          Overview Dashboard
        </h1>

        {/* Responsive Grid Layout */}
        <div
          className="grid grid-cols-1 gap-6
                        sm:grid-cols-2 
                        lg:grid-cols-3 
                        xl:grid-cols-4"
        >
          {/* 3. Visualization Cards (Sales Trend, Total Users) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <DataCard title="Sales Trend" size="small" type="line" />
          </div>
          <div className="sm:col-span-1 lg:col-span-1">
            <DataCard
              title="Total Users"
              size="small"
              type="summary"
              value="15,450"
              change="+2.5%"
            />
          </div>

          {/* Secondary Visualization Cards (Revenue, Top Products) */}
          <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <DataCard title="Top Selling Products" size="large" type="line" />
          </div>
          <div className="sm:col-span-1 lg:col-span-1 xl:col-span-1">
            <DataCard title="Revenue by Source" size="small" type="bar" />
          </div>
          <div className="sm:col-span-1 lg:col-span-1 xl:col-span-1">
            <DataCard title="Revenue by Channel" size="small" type="donut" />
          </div>

          {/* Add more dashboard items here */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
