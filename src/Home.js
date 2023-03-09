import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from './Navbar';
import { auth } from './config';
import { signOut } from 'firebase/auth';

export default function Home() {
    const navigate = useNavigate();

    // Event handler when signing out
    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate('/login', { replace: true });
        })
            .catch((error) => {
                alert(error.message);
            })
    }

    return (
        
        <section className="bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <button type="btn" onClick={handleSignOut} className="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800">Abmelden</button>
        </section>
    );
}
