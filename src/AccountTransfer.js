import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import createTransferDoc from "./functions/transaction";

import { auth, firestore } from "./config";
import { doc, getDoc, collection, getDocs, query, where, updateDoc } from "firebase/firestore";;

export default function AccountTransfer() {
    const [debitAcc, setDebitAcc] = useState("");
    const [creditAcc, setCreditAcc] = useState("");
    const [amount, setAmount] = useState("");
    const [comment, setComment] = useState("");

    const [accounts, setAccounts] = useState([]);
    const [debitAccs, setDebitAccs] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        function fetchData() {
            // Defining all types of accounts
            var types = ["Privatkonto", "Sparkonto"];
            // Defining array for all accounts
            var debitAccs = [];
            var accounts = [];
            //Looping through all types of accounts
            for (let i = 0; i < types.length; i++) {
                getDocs(query(collection(firestore, "users", auth.currentUser.uid, "accounts"), where("type", "==", types[i])))
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            const newAccount = {
                                label: doc.data().name + ": " + doc.data().iban + " - " + doc.data().balance + " CHF",
                                value: doc.data().iban
                            };
                            // Put datas into array for all accounts
                            if (doc.data().balance != "0") {
                                debitAccs[debitAccs.length] = newAccount;
                            }
                            accounts[accounts.length] = newAccount;
                        });
                        // Set useState with the accounts
                        setAccounts(accounts);
                        setDebitAccs(debitAccs);
                    }).catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
            }

        };
        fetchData();
    }, []);

    const preTransfer = (event) => {
        event.preventDefault();
        if (debitAcc === creditAcc) {
            alert("Sie können nicht auf das gleiche Konto transferieren.");
        } else {
            transfer();
        }
    }

    const transfer = () => {
        const debitRef = doc(firestore, "users", auth.currentUser.uid, "accounts", debitAcc);
        const creditRef = doc(firestore, "users", auth.currentUser.uid, "accounts", creditAcc);

        const debitSnap = getDoc(debitRef);
        const creditSnap = getDoc(creditRef);

        debitSnap.then((debitDoc) => {
            if (Number(debitDoc.data().balance) < Number(amount)) {
                alert("Der Betrag ist zu hoch als das Ihr Konto zur Verfügung hat.");
            } else {
                updateDoc(debitRef, {
                    balance: (Number(debitDoc.data().balance) - Number(amount))
                });
                
                creditSnap.then((creditDoc) => {
                    updateDoc(creditRef, {
                        balance: (Number(creditDoc.data().balance) + Number(amount))
                    });
                });
                createTransaction();
            }
        });
    }

    const createTransaction = () => {
        getDoc(doc(firestore, "users", auth.currentUser.uid))
        .then((userSnap) => {
            createTransferDoc(auth.currentUser.uid, auth.currentUser.uid, userSnap.data().surname, userSnap.data().name, userSnap.data().surname, userSnap.data().name, debitAcc, creditAcc, amount, comment, "Kontoübertrag");
        })
        navigate('/Web-Kontenfuehrung/home', { replace: true });;
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
                        <select onChange={(e) => setDebitAcc(e.target.value)} name="debitAcc" id="debitAcc" className="select w-full max-w-xs" required={true}>
                            <option disabled selected>Wähle ein Belastungskonto aus</option>
                            {debitAccs.map((account) => (
                                <option key={account.value} value={account.value}>{account.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="creditAcc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Gutschriftskonto</label>
                        <select onChange={(e) => setCreditAcc(e.target.value)} name="creditAcc" id="creditAcc" className="select w-full max-w-xs" required={true}>
                            <option disabled selected>Wähle ein Gutschriftskonto aus</option>
                            {accounts.map((account) => (
                                <option key={account.value} value={account.value}>{account.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input type="text" name="comment" id="comment" onChange={(e) => setComment(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Kommentar eingeben" />
                    </div>
                    <div>
                        <div className="form-control">
                            <label className="input-group">
                                <input type="number" min="0" placeholder="Betrag eingeben" onChange={(e) => setAmount(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                                <span>CHF</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">Ausführen</button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        <Link to='/Web-Kontenfuehrung/home' className="font-medium text-emerald-600 hover:underline dark:text-emerald-500">Abbrechen</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
