import React from 'react';
import RegisterPage from './Pages/RegisterPage'
import LoginPage from './Pages/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardPage from './Pages/Dashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage/> } />
          <Route path="/" element={<h1>Home</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
