import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Login from './Login';
import Registration from './Registration';
import CreateAccount from './CreateAccount';
import AccountTransfer from './AccountTransfer';
import CreatePayment from './CreatePayment';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/createAccount' element={<CreateAccount />} />
        <Route path='/accountTransfer' element={<AccountTransfer />} />
        <Route path='/createPayment' element={<CreatePayment />} />
      </Routes>
    </div>

  );
}

export default App;
