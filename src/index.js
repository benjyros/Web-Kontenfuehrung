import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Navbar from './Navbar';
import reportWebVitals from './reportWebVitals';
import { renderHook } from '@testing-library/react';

const navbar = ReactDOM.createRoot(document.getElementById('navbar'));
const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

const renderNavbar = () => {
  navbar.render(<Navbar />);
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
renderNavbar();
renderApp();