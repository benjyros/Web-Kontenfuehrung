import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import createIban from '../functions/iban';

import { auth, firestore } from "../config";
import { doc, setDoc } from "firebase/firestore";

export default function CreateAccount() {
    const [name, setName] = useState("");
    const [interest, setInterest] = useState("");

    const navigate = useNavigate();

    // Create saving account for user
    const createAccount = (event) => {
        event.preventDefault();
        writeIntoDB();
    }

    const writeIntoDB = () => {
        const iban = createIban();
        setDoc(doc(firestore, "users", auth.currentUser.uid, "accounts", iban), {
            iban: iban,
            type: "Sparkonto",
            name: name,
            interest: interest,
            balance: 0,
        });
        navigate('/', { replace: true });
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Sparkonto erstellen
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={createAccount}>
                    <div>
                        <input type="text" name="comment" id="comment" onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Bennenung" required="true" />
                    </div>
                    <div>
                        <div className="form-control">
                            <label className="input-group">
                                <input type="number" min="0" max="0.5" step="0.1" placeholder="Zinssatz" onChange={(e) => setInterest(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true" />
                                <span>%</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">Sparkonto eröffnen</button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        <Link to='/' className="font-medium text-emerald-600 hover:underline dark:text-emerald-500">Abbrechen</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
