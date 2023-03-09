import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
