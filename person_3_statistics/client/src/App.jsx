import React, { useState } from 'react';
import StatsPage from './components/StatsPage';

const App = () => {
  const [currentView, setCurrentView] = useState('tasks');

  return (
    <div style={{ fontFamily: 'sans-serif', margin: '0 auto', maxWidth: '800px', padding: '20px' }}>
      <h1>Git Workshop Todo App</h1>
      
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <button 
          onClick={() => setCurrentView('tasks')}
          style={{ 
            marginRight: '10px', 
            padding: '8px 16px',
            backgroundColor: currentView === 'tasks' ? '#007bff' : '#f8f9fa',
            color: currentView === 'tasks' ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tasks
        </button>
        <button 
          onClick={() => setCurrentView('stats')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: currentView === 'stats' ? '#007bff' : '#f8f9fa',
            color: currentView === 'stats' ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Statistics
        </button>
      </nav>

      <main>
        {currentView === 'tasks' ? (
          <div>
            <h2>Tasks List View</h2>
            <p>(Mock Task List - Person 1, 2, 4, 5, 6 will build this)</p>
          </div>
        ) : (
          <StatsPage />
        )}
      </main>
    </div>
  );
};

export default App;
