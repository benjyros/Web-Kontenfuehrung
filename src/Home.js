import React from 'react';

import Navbar from './components/Navbar';
import Accounts from './components/Accounts';

export default function Home() {
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <Accounts />
        </section>
    );
}
