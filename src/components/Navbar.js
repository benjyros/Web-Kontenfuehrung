import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { auth } from '../config';
import { signOut } from 'firebase/auth';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Event handler when signing out
    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate('/login', { replace: true });
        }).catch((error) => {
            alert(error.message);
        })
    }

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex="0" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex="0" className="menu menu-compact dropdown-content shadow bg-base-100 rounded-box w-52">
                        <li className={`${location.pathname === '/' ? 'bordered' : ''}`}><Link to='/'>Vermögensübersicht</Link></li>
                        <li className={`${location.pathname === '/createPayment' ? 'bordered' : ''}`}><Link to='/createPayment'>Zahlung erfassen</Link></li>
                        <li className={`${location.pathname === '/accountTransfer' ? 'bordered' : ''}`}><Link to='/accountTransfer'>Kontoübertrag</Link></li>
                        <li className={`${location.pathname === '/createAccount' ? 'bordered' : ''}`}><Link to='/createAccount'>Sparkonto erstellen</Link></li>
                    </ul>
                </div>
                <Link to='/login' className="btn btn-ghost normal-case text-xl">Twäwis Onlinebanking</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu-horizontal px-1tabs">
                <li><Link to='/' className={`${location.pathname === '/' ? 'tab-active' : ''} tab tab-bordered`}>Vermögensübersicht</Link></li>
                    <li><Link to='/createPayment' className={`${location.pathname === '/createPayment' ? 'tab-active' : ''} tab tab-bordered`}>Zahlung erfassen</Link></li>
                    <li><Link to='/accountTransfer' className={`${location.pathname === '/accountTransfer' ? 'tab-active' : ''} tab tab-bordered`}>Kontoübertrag</Link></li>
                    <li><Link to='/createAccount' className={`${location.pathname === '/createAccount' ? 'tab-active' : ''} tab tab-bordered`}>Sparkonto erstellen</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <Link className="btn" onClick={handleSignOut}>Abmelden</Link>
            </div>
        </div>
    );
}

export default Navbar;
