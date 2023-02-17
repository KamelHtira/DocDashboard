import { parse, isDate } from "date-fns";
import { shell } from "electron";
import { backendURL } from "./constants";
import { ipcRenderer } from "electron";





function parseDateString(value, originalValue) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "MM/dd/yyyy", new Date());

  return parsedDate;
}

function getSelectedPatientsEmails(patientsList, selectedPatientIds) {
  let ArrayOfSelectedPatientEmails = [];
  patientsList.map((patient) => {
    if (selectedPatientIds.includes(patient._id)) {
      ArrayOfSelectedPatientEmails.push(patient.email);
    }
  });
  return ArrayOfSelectedPatientEmails;
}
const generateTransactionsTypeStype = (type) => {
  if (type == "Income") {
    return {
      backgroundColor: "#66bb6a",
      display: "inline",
      padding: "3px 7px",
      borderRadius: "10px",
      color: "white",
    };
  } else if (type == "Outcome")
    return {
      backgroundColor: "#ef5350",
      display: "inline",
      padding: "3px 7px",
      borderRadius: "10px",
      color: "white",
    };
};

function getSelectedTransactionsIdsAmount(
  transactionsList,
  selectedTransactionIds
) {
  let ArrayOfSelectedTransactionAmounts = [];
  transactionsList.map((transaction) => {
    if (selectedTransactionIds.includes(transaction._id)) {
      ArrayOfSelectedTransactionAmounts.push(
        `ID ${transaction._id}: ${transaction.amount}dt`
      );
    }
  });
  return ArrayOfSelectedTransactionAmounts;
}

function getTransactionById(transactionsList, id) {
  let matchedTransaction = {
    amount: "ID not found",
    type: "N/A",
    date: "N/A",
    description: "N/A",
  };
  transactionsList.map((currentTransaction) => {
    if (currentTransaction._id === id) {
      matchedTransaction = {
        amount: currentTransaction.amount,
        type: currentTransaction.type,
        date: currentTransaction.date,
        description: currentTransaction.description,
      };
    }
  });
  return matchedTransaction;
}

function filterDataFromIds(data, ids) {
  let ArrayOfSelectedTransaction = [];
  data.map((transaction) => {
    if (ids.includes(transaction._id)) {
      ArrayOfSelectedTransaction.push(transaction);
    }
  });
  return ArrayOfSelectedTransaction;
}

function sendDownloadEvent(ids,data) {
  ipcRenderer.send("download", filterDataFromIds(data, ids));
}

export {
  getSelectedPatientsEmails,
  generateTransactionsTypeStype,
  parseDateString,
  getSelectedTransactionsIdsAmount,
  getTransactionById,
  filterDataFromIds,
  sendDownloadEvent
};