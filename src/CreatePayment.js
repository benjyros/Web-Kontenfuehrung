import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import createTransferDoc from "./functions/transaction";

import { auth, firestore } from "./config";
import { doc, getDoc, collection, getDocs, where, updateDoc, query } from "firebase/firestore";

export default function CreatePayment() {
    const [debitAcc, setDebitAcc] = useState("");
    const [balance, setBalance] = useState("");
    const [iban, setIban] = useState("");
    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [amount, setAmount] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        function fetchData() {
            getDocs(collection(firestore, "users", auth.currentUser.uid, "accounts"), where("type", "==", "Privatkonto"))
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        setDebitAcc(doc.data().iban);
                        setBalance(doc.data().balance)
                    })
                }).catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        };
        fetchData();
    }, []);

    const preTransfer = (event) => {
        event.preventDefault();
        if (debitAcc === iban) {
            alert("Sie können nicht Ihr eigenes Privatkonto angeben.");
        } else if (amount === "") {
            alert("Bitte geben Sie einen Betrag ein.");
        } else if (iban != "" && surname != "" && name != "") {
            tranfer();
        } else {
            alert("Bitte überprüfen Sie die Daten nochmals.");
        }
    }

    const tranfer = () => {
        getDocs(query(collection(firestore, "users"), where("surname", "==", surname), where("name", "==", name)))
            .then((snapshot1) => {
                if (snapshot1.empty) {
                    alert("Dieser Empfänger existiert nicht.");
                }
                snapshot1.forEach((document) => {
                    getDocs(query(collection(firestore, "users", document.data().id, "accounts"), where("iban", "==", iban)))
                        .then((snapshot2) => {
                            if (snapshot2.empty) {
                                alert("Die IBAN existiert nicht.")
                            } else {
                                const debitRef = doc(firestore, "users", auth.currentUser.uid, "accounts", debitAcc);
                                const creditRef = doc(firestore, "users", document.data().id, "accounts", iban);

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
                                        createTransaction(document.data().id, document.data().surname, document.data().name);
                                    }
                                });
                            }

                        }).catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                })
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    const createTransaction = (creditorId, receiverSurname, receiverName) => {
        getDoc(doc(firestore, "users", auth.currentUser.uid))
            .then((userSnap) => {
                createTransferDoc(auth.currentUser.uid, creditorId, receiverSurname, receiverName, userSnap.data().surname, userSnap.data().name, debitAcc, iban, amount, comment, "Zahlung");
            })
        navigate('/', { replace: true });
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Zahlung erfassen
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={preTransfer}>
                    <div>
                        <input type="text" name="iban" id="iban" onChange={(e) => setIban(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="IBAN eingeben" required={true} />
                    </div>
                    <div>
                        <input type="text" name="surname" id="surname" onChange={(e) => setSurname(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name des Empfängers" required={true} />
                    </div>
                    <div>
                        <input type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Vorname des Empfängers" required={true} />
                    </div>
                    <div>
                        <input type="text" name="comment" id="comment" onChange={(e) => setComment(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Kommentar eingeben" />
                    </div>
                    <div>
                        <p>Belastung auf Privatkonto:</p>
                        <p>{debitAcc} - {balance} CHF</p>
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
                        <Link to='/' className="font-medium text-emerald-600 hover:underline dark:text-emerald-500">Abbrechen</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
