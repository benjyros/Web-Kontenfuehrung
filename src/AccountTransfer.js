import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { auth, firestore } from "./config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function AccountTransfer() {
    const [debitAcc, setDebitAcc] = useState("");
    const [creditAcc, setCreditAcc] = useState("");
    const [amount, setAmount] = useState("");
    const [comment, setComment] = useState("");

    const [openDebitAcc, setOpenDebitAcc] = useState(false);
    const [openCreditAcc, setOpenCreditAcc] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [debitAccs, setDebitAccs] = useState([]);

    const preTransfer = () => {
        if (debitAcc === creditAcc) {
            alert("Sie können nicht auf das gleiche Konto transferieren.");
        } else {
            //transfer();
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Kontoübertrag
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={preTransfer}>
                    <div>
                        <label htmlFor="debitAcc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Belastungskonto</label>
                        <select onChange={(e) => setDebitAcc(e.target.value)} name="debitAcc" id="debitAcc" className="select w-full max-w-xs" required="true">
                            <option disabled selected>Wähle ein Belastungskonto aus</option>
                            <option>Homer</option>
                            <option>Marge</option>
                            <option>Bart</option>
                            <option>Lisa</option>
                            <option>Maggie</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="creditAcc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Belastungskonto</label>
                        <select onChange={(e) => setCreditAcc(e.target.value)} name="creditAcc" id="creditAcc" className="select w-full max-w-xs" required="true">
                            <option disabled selected>Wähle ein Gutschriftskonto aus</option>
                            <option>Homer</option>
                            <option>Marge</option>
                            <option>Bart</option>
                            <option>Lisa</option>
                            <option>Maggie</option>
                        </select>
                    </div>
                    <div>
                        <input type="text" name="comment" id="comment" onChange={(e) => setComment(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Kommentar eingeben" />
                    </div>
                    <div>
                        <div className="form-control">
                            <label className="input-group">
                                <input type="number" min="0" placeholder="Betrag eingeben" onChange={(e) => setAmount(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true" />
                                <span>CHF</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">Ausführen</button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        <Link to='/home' className="font-medium text-emerald-600 hover:underline dark:text-emerald-500">Abbrechen</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}