import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/registration' element={<Registration />} />
        <Route exact path='/createAccount' element={<CreateAccount />} />
        <Route exact path='/accountTransfer' element={<AccountTransfer />} />
        <Route exact path='/createPayment' element={<CreatePayment />} />
      </Routes>
    </div>
  );
}

export default App;
