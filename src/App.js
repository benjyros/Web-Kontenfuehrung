import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import CreateAccount from './components/CreateAccount';
import AccountTransfer from './components/AccountTransfer';
import CreatePayment from './components/CreatePayment';

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={<Login />} />
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
