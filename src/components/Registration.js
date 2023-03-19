import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import createIban from '../functions/iban';

import { auth, firestore } from "../config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Registration() {
    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVal, setPasswordVal] = useState("");

    const navigate = useNavigate();
    // Event handler for signing up

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                // Add created user to database
                addUserToDB();
            })
            .catch((error) => {
                console.log(error);
                alert("Bitte überprüfen Sie ihre Angaben.");
            });
    }

    // Function for adding user to db
    const addUserToDB = async () => {
        await setDoc(doc(firestore, "users", auth.currentUser.uid), {
            id: auth.currentUser.uid,
            surname: surname,
            name: name,
            email: email
        });
        createAccForUser();
    }

    // Function for adding an private account for user
    const createAccForUser = async () => {
        const iban = createIban();
        await setDoc(doc(firestore, "users", auth.currentUser.uid, "accounts", iban), {
            iban: iban,
            type: "Privatkonto",
            name: "Privatkonto",
            interest: "0.1",
            balance: 50,
        });
        navigate('/', { replace: true });
    }

    // Function for creating user
    function createUser(event) {
        event.preventDefault();
        // Validate if all inputs are filled out
        if (name !== "" && surname !== "" && email !== "" && password !== "" && passwordVal !== "") {
            if (password === passwordVal) {
                handleSignUp();
            }
            else {
                alert("Die Passwörter stimmen nicht überein,");
            }
        }
        else {
            alert("Bitte füllen Sie das Formular vollständig aus.");
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Registrierung
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={createUser}>
                            <div>
                                <input type="surname" name="surname" id="surname" onChange={(e) => setSurname(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" required="true" />
                            </div>
                            <div>
                                <input type="name" name="name" id="name" onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Vorname" required="true" />
                            </div>
                            <div>
                                <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="E-Mail" required="true" />
                            </div>
                            <div>
                                <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Passwort" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true" />
                            </div>
                            <div>
                                <input type="password" name="confirm-password" onChange={(e) => setPasswordVal(e.target.value)} id="confirm-password" placeholder="Passwort bestätigen" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true" />
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="true" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-emerald-600 hover:underline dark:text-emerald-500" href="#">Terms and Conditions</a></label>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">Abschliessen</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Schon ein Konto? <Link to='/login' className="font-medium text-emerald-600 hover:underline dark:text-emerald-500">Hier Anmelden</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Registration;
