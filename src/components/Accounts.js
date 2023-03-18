import React, { useEffect, useState } from 'react';

import { auth, firestore } from "../config";
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [selected, setSelected] = useState(1);

    const selectedAccount = accounts.find(({ id }) => id === selected);

    useEffect(() => {
        function fetchData() {
            // Defining all types of accounts
            var types = ["Privatkonto", "Sparkonto"];
            // Defining array for all accounts
            var accounts = [];
            let count = 0;
            //Looping through all types of accounts
            for (let i = 0; i < types.length; i++) {
                // Query accounts where {types[i]}
                getDocs(query(collection(firestore, "users", auth.currentUser.uid, "accounts"), where("type", "==", types[i])))
                    .then((snapshot) => {
                        //create array of promises
                        snapshot.forEach((doc) => {
                            const account = {
                                account: getData(doc, count)
                            }

                            accounts.push(account);
                        })
                    })
            }
            // Set useState with the accounts
            setAccounts(accounts);
        };
        fetchData();
    }, []);

    //function that return promise
    function getData(doc, accounts) {
        var todaysTransactions = [];
        var transactions = [];

        getDocs(collection(firestore, "users", auth.currentUser.uid, "accounts", doc.data().iban, "transactions"))
            .then((transactionsSnap) => {
                transactionsSnap.forEach((doc2) => {
                    getDocs(collection(firestore, "users", auth.currentUser.uid, "accounts", doc.data().iban, "transactions", doc2.data().date, "todaysTransactions"))
                        .then((todaysTransactionSnap) => {
                            todaysTransactionSnap.forEach((doc3) => {
                                const transaction = {
                                    type: doc3.data().type,
                                    amount: doc3.data().amount,
                                    who: doc3.data().who,
                                    comment: doc3.data().comment
                                }

                                todaysTransactions.push(transaction);
                            })
                            const todaysTransaction = {
                                date: doc2.data().date,
                                todaysTransactions: todaysTransactions
                            }
                            transactions.push(todaysTransaction);

                            todaysTransactions = [];
                        })
                });
            })

        const newAccount = {
            id: accounts + 1,
            name: doc.data().name,
            balance: doc.data().balance + " CHF",
            interest: doc.data().interest + "%",
            transactions: transactions
        };

        transactions = [];

        return newAccount;
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            Accounts
        </section>
    );
}
