import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../config';
import { onAuthStateChanged } from 'firebase/auth';

import Navbar from './Navbar';
import Accounts from './Accounts';

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login', { replace: true });
            }
            return unsubscribe;
        });
    }, []);

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <Accounts />
        </section>
    );
}
