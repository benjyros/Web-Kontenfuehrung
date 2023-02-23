import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Login from './Login';
import Registration from './Registration';

import { auth } from './config';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Home");
      } else {
        setEmail("");
        setPassword("");
      }
      return unsubscribe;
    });
  }, []);

  return (
    <div className='App'>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/registration' element={<Registration />} />
      </Routes>
    </div>

  );
}

export default App;
