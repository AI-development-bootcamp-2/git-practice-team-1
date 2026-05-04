import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  todo: '#8884d8',
  'in-progress': '#82ca9d',
  review: '#ffc658',
  done: '#ff8042'
};

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch stats from our mocked endpoint or main server
    fetch('http://localhost:3001/api/todos/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        // For demonstration, we'll mock the data if the server is not running
        setStats({
          total: 3,
          byStatus: { todo: 1, 'in-progress': 1, review: 0, done: 1 },
          completionPercent: 33,
          createdByDate: { '2026-05-01': 1, '2026-05-02': 1, '2026-05-03': 1 }
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (!stats) return <div>No stats available.</div>;

  // Prepare data for PieChart
  const pieData = Object.keys(stats.byStatus).map(key => ({
    name: key,
    value: stats.byStatus[key]
  }));

  // Prepare data for BarChart
  const barData = Object.keys(stats.createdByDate).map(date => ({
    date,
    count: stats.createdByDate[date]
  }));

  return (
    <div className="stats-page" style={{ padding: '20px' }}>
      <h2>Project Statistics</h2>
      
      <div className="metric-cards" style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
          <h3>Total Tasks</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</p>
        </div>
        <div className="card" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
          <h3>Completion</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.completionPercent}%</p>
        </div>
      </div>

      <div className="charts" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div className="chart-container" style={{ flex: '1 1 400px', height: '300px' }}>
          <h3>Tasks by Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container" style={{ flex: '1 1 400px', height: '300px' }}>
          <h3>Tasks Created by Date</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
