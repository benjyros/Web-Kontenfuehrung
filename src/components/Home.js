import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";

import { auth, firestore } from "../config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);

  const selectedAccount = accounts.find(({ id }) => id === selected);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const types = ["Privatkonto", "Sparkonto"];
        const accounts = [];
        let count = 0;

        for (let i = 0; i < types.length; i++) {
          const querySnapshot = await getDocs(
            query(
              collection(firestore, "users", auth.currentUser.uid, "accounts"),
              where("type", "==", types[i])
            )
          );
          const accountPromises = querySnapshot.docs.map(async (doc) => {
            const transactionsRef = collection(
              firestore,
              "users",
              auth.currentUser.uid,
              "accounts",
              doc.data().iban,
              "transactions"
            );

            const transactionGroups = [];

            const transactionsSnapshot = await getDocs(transactionsRef);

            transactionsSnapshot.forEach((transactionDoc) => {
              const todaysTransactionsRef = collection(
                transactionsRef,
                transactionDoc.data().date,
                "todaysTransactions"
              );
              const todaysTransactionsPromise = getDocs(
                todaysTransactionsRef
              ).then((todaysTransactionsSnapshot) => {
                const todaysTransactions = todaysTransactionsSnapshot.docs.map(
                  (todaysTransactionDoc) => ({
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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      } else {
        navigate("/login", { replace: true });
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold text-center">Loading...</h1>
      </div>
    );
  }

  return (
    <section className="">
      <Navbar />
      <div className="bg-base-100 flex flex-row items-center overflow-x-auto whitespace-nowrap h-[220px] px-5 space-x-10 drop-shadow-md">
        {accounts.map((account) => (
          <button
            key={account.id}
            className={`${
              selected === account.id ? "bg-blue-500 text-white" : "bg-gray-200"
            } p-10 rounded-md mx-2 w-80 flex flex-shrink-0 justify-between`}
            onClick={() => {
              setSelected(account.id);
            }}
          >
            <div className="font-bold text-2xl">{account.name}</div>
            <div>
              <div>{account.balance}</div>
              <div>{account.interest}</div>
            </div>
          </button>
        ))}
      </div>

      {selectedAccount && (
        <div className="pt-12 bg-neutral h-screen">
          <h2 className="text-left font-bold text-4xl ml-10">Transaktionen</h2>
          <div className="w-screen flex justify-center items-center pt-12">
            <div className="overflow-x-auto w-2/3 mr-80">
              {selectedAccount.transactions.map((transactionGroup) => (
                <table className="table w-full">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Bezeichnung</th>
                      <th>Belastung</th>
                      <th>Gutschrift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionGroup.todaysTransactions.map((transaction) => (
                      <tr>
                        <th key={transaction.comment}>
                          {transactionGroup.date}
                        </th>
                        <td>
                          {transaction.type} - {transaction.who}
                        </td>
                        <td>{transaction.amount}</td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
