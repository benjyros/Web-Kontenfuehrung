import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../config";


export default async function createTransferDoc(debitorId, creditorId, receiverSurname, receiverName, senderSurname, senderName, debitAcc, creditAcc, amount, comment, type) {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setDoc(doc(firestore, "users", debitorId, "accounts", debitAcc, "transactions", formattedDate, "todaysTransactions", timestamp.toString()), {
        timestamp: timestamp,
        amount: "- " + amount + " CHF",
        comment: comment,
        type: type,
        who: "an " + receiverSurname + " " + receiverName
    });
    setDoc(doc(firestore, "users", creditorId, "accounts", creditAcc, formattedDate, timestamp.toString()), {
        timestamp: timestamp,
        amount: "+" + amount + " CHF",
        comment: comment,
        type: type,
        who: "von " + senderSurname + " " + senderName
    });
}
