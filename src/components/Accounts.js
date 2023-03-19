import React, { useEffect, useState } from 'react';

import { auth, firestore } from "../config";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(true);

    const selectedAccount = accounts.find(({ id }) => id === selected);

    useEffect(() => {
        async function fetchData() {
            try {
                const types = ["Privatkonto", "Sparkonto"];
                const accounts = [];
                let count = 0;

                for (let i = 0; i < types.length; i++) {
                    const querySnapshot = await getDocs(query(collection(firestore, "users", auth.currentUser.uid, "accounts"), where("type", "==", types[i])));
                    const accountPromises = querySnapshot.docs.map(async (doc) => {
                        const transactionsRef = collection(firestore, "users", auth.currentUser.uid, "accounts", doc.data().iban, "transactions");

                        const transactionGroups = [];

                        const transactionsSnapshot = await getDocs(transactionsRef);

                        transactionsSnapshot.forEach((transactionDoc) => {
                            const todaysTransactionsRef = collection(transactionsRef, transactionDoc.data().date, "todaysTransactions");
                            const todaysTransactionsPromise = getDocs(todaysTransactionsRef).then((todaysTransactionsSnapshot) => {
                                const todaysTransactions = todaysTransactionsSnapshot.docs.map((todaysTransactionDoc) => ({
                                    type: todaysTransactionDoc.data().type,
                                    amount: todaysTransactionDoc.data().amount,
                                    who: todaysTransactionDoc.data().who,
                                    comment: todaysTransactionDoc.data().comment,
                                }));

                                return { date: transactionDoc.data().date, todaysTransactions };
                            });

                            transactionGroups.push(todaysTransactionsPromise);
                        });

                        const transactionGroupsResolved = await Promise.all(
                            transactionGroups
                        );

                        const newAccount = {
                            id: count++,
                            iban: doc.data().iban,
                            name: doc.data().name,
                            balance: doc.data().balance + " CHF",
                            interest: doc.data().interest + "%",
                            transactions: transactionGroupsResolved,
                        };

                        return newAccount;
                    });

                    const accountPromisesResolved = await Promise.all(accountPromises);

                    accounts.push(...accountPromisesResolved);
                }

                setAccounts(accounts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchData();
            }
        });
        return unsubscribe;
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-row overflow-x-auto">
                {accounts.map((account) => (
                    <button
                        key={account.id}
                        className={`${selected === account.id ? 'bg-blue-500 text-white' : 'bg-gray-200'} p-4 rounded-md mx-2`}
                        onClick={() => { setSelected(account.id) }}
                    >
                        <div className="font-bold">{account.name}</div>
                        <div>{account.balance}</div>
                        <div>{account.interest}</div>
                    </button>
                ))}
            </div>
            {selectedAccount && (
                <div>
                    <h2>Transaktionen</h2>
                    {selectedAccount.transactions.map((transactionGroup) => (
                        <details key={transactionGroup.date}>
                            <summary>{transactionGroup.date}</summary>
                            <ul>
                                {transactionGroup.todaysTransactions.map((transaction) => (
                                    <li key={transaction.comment}>
                                        <strong>{transaction.type}:</strong> {transaction.amount} - {transaction.who}
                                        <p>Kommentar: {transaction.comment}</p>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    ))}
                </div>
            )}
        </section>
    );
}
