"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsCharts({ stats }) {
  if (!stats) return null;

  // 1. Status Bar Chart
  const statusData = {
    labels: stats.byStatus ? Object.keys(stats.byStatus).map(s => s.charAt(0) + s.slice(1).toLowerCase()) : [],
    datasets: [{
      label: 'Applications',
      data: stats.byStatus ? Object.values(stats.byStatus) : [],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      borderRadius: 8,
    }]
  };

  // 2. Major Pie Chart
  const majorData = {
    labels: stats.byMajor ? stats.byMajor.map(m => m.major) : [],
    datasets: [{
      data: stats.byMajor ? stats.byMajor.map(m => m.count) : [],
      backgroundColor: ['#6366F1', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B'],
      borderWidth: 0,
    }]
  };

  // 3. Monthly Line Chart
  const monthlyData = {
    labels: stats.monthly ? stats.monthly.map(m => m.month) : [],
    datasets: [{
      fill: true,
      label: 'New Applications',
      data: stats.monthly ? stats.monthly.map(m => m.count) : [],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false,
        labels: { color: '#475569', font: { weight: '600' } }
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0,0,0,0.1)' },
        ticks: { color: '#64748b', font: { weight: '500' } }
      },
      x: { 
        grid: { display: false },
        ticks: { color: '#64748b', font: { weight: '500' } }
      }
    }
  };

  const cardStyle = {
    padding: '24px',
    height: '350px',
    background: 'white',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '15px',
    fontWeight: '800',
    marginBottom: '20px',
    color: '#1e293b'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '20px' }}>
      
      {/* Monthly Trend */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Monthly Applications</h3>
        <div style={{ height: '240px' }}>
          <Line data={monthlyData} options={options} />
        </div>
      </div>

      {/* Status Breakdown */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Status Breakdown</h3>
        <div style={{ height: '240px' }}>
          <Bar data={statusData} options={options} />
        </div>
      </div>

      {/* Majors Pie */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Applications by Major</h3>
        <div style={{ height: '240px', display: 'flex', justifyContent: 'center' }}>
          <Pie data={majorData} options={{ ...options, plugins: { legend: { display: true, position: 'bottom', labels: { color: '#475569', usePointStyle: true, padding: 15 } } } }} />
        </div>
      </div>

    </div>
  );
}
