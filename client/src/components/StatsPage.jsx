import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import './StatsPage.css';

const COLORS = {
  todo: '#8b5cf6',
  'in-progress': '#3b82f6',
  review: '#f59e0b',
  done: '#10b981'
};

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.todos.getStats({
        from: fromDate || undefined,
        to: toDate || undefined
      });
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      // Fallback for demonstration if needed
      setStats({
        total: 0, todo: 0, done: 0, overdue: 0,
        byStatus: { todo: 0, 'in-progress': 0, review: 0, done: 0 },
        completionPercent: 0,
        createdByDate: {}
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fromDate, toDate]);

  if (loading && !stats) return <div className="loading">Loading statistics...</div>;
  if (!stats) return <div className="empty-state">No stats available.</div>;

  // Prepare data for PieChart
  const pieData = Object.keys(stats.byStatus).map(key => ({
    name: key,
    value: stats.byStatus[key]
  })).filter(item => item.value > 0);

  // Prepare data for BarChart
  const barData = Object.keys(stats.createdByDate).map(date => ({
    date,
    count: stats.createdByDate[date]
  }));

  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h2>Project Statistics</h2>
        
        <div className="stats-filters">
          <label className="date-filter">
            From:
            <input 
              type="date" 
              className="date-input" 
              value={fromDate} 
              onChange={e => setFromDate(e.target.value)} 
            />
          </label>
          <label className="date-filter">
            To:
            <input 
              type="date" 
              className="date-input" 
              value={toDate} 
              onChange={e => setToDate(e.target.value)} 
            />
          </label>
          {(fromDate || toDate) && (
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              Clear
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="metric-cards">
        <div className="metric-card total">
          <h3>Total Tasks</h3>
          <div className="metric-value">{stats.total}</div>
        </div>
        <div className="metric-card completion">
          <h3>Completion</h3>
          <div className="metric-value">{stats.completionPercent}%</div>
        </div>
        <div className="metric-card todo">
          <h3>To Do</h3>
          <div className="metric-value">{stats.todo}</div>
        </div>
        <div className="metric-card done">
          <h3>Done</h3>
          <div className="metric-value">{stats.done}</div>
        </div>
        <div className="metric-card overdue">
          <h3>Overdue</h3>
          <div className="metric-value">{stats.overdue}</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Tasks by Status</h3>
          <div className="chart-container">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No tasks to display
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3>Tasks Created by Date</h3>
          <div className="chart-container">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280' }} tickMargin={10} />
                  <YAxis allowDecimals={false} tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(67, 97, 238, 0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#4361ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No tasks in selected range
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
