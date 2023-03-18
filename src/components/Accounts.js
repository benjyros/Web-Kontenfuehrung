import React, { useEffect, useState } from 'react';

import { auth, firestore } from "../config";
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [selected, setSelected] = useState(1);
    const [loading, setLoading] = useState(true);

    const selectedAccount = accounts.find(({ id }) => id === selected);

    useEffect(() => {
        async function fetchData() {
            try {
                const types = ["Privatkonto", "Sparkonto"];
                const accounts = [];

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
                                })
                                );

                                return { date: transactionDoc.data().date, todaysTransactions };
                            });

                            transactionGroups.push(todaysTransactionsPromise);
                        });

                        const transactionGroupsResolved = await Promise.all(
                            transactionGroups
                        );

                        const newAccount = {
                            id: accounts.length + 1,
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
            <table>
                <thead>
                    <tr>
                        <th>Account Name</th>
                        <th>Balance</th>
                        <th>Interest</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account) => (
                        <tr key={account.id} onClick={() => setSelected(account.id)}>
                            <td>{account.name}</td>
                            <td>{account.balance}</td>
                            <td>{account.interest}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedAccount && (
                <div>
                    <h2>{selectedAccount.name}</h2>
                    {selectedAccount.transactions.map((transactionGroup) => (
                        <details key={transactionGroup.date}>
                            <summary>{transactionGroup.date}</summary>
                            <ul>
                                {transactionGroup.todaysTransactions.map((transaction) => (
                                    <li key={transaction.comment}>
                                        <strong>{transaction.type}</strong> - {transaction.amount} - {transaction.who} - {transaction.comment}
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
