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
        <Route path='/Web-Kontenfuehrung/login' element={<Login />} />
        <Route path='/Web-Kontenfuehrung/home' element={<Home />} />
        <Route path='/Web-Kontenfuehrung/registration' element={<Registration />} />
        <Route path='/Web-Kontenfuehrung/createAccount' element={<CreateAccount />} />
        <Route path='/Web-Kontenfuehrung/accountTransfer' element={<AccountTransfer />} />
        <Route path='/Web-Kontenfuehrung/createPayment' element={<CreatePayment />} />
      </Routes>
    </div>

  );
}

export default App;
