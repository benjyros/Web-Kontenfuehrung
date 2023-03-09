import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Login from './Login';
import Registration from './Registration';
import AccountTransfer from './AccountTransfer';

import { auth } from './config';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/accountTransfer' element={<AccountTransfer />} />
      </Routes>
    </div>

  );
}

export default App;
