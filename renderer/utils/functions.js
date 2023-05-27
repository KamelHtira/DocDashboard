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

function getPatientsFullNames(patientsList) {
  let ArrayOfPatientsFullNames = [];
  patientsList.map((patient) => {
    ArrayOfPatientsFullNames.push(patient.firstName + " " + patient.lastName);
  });
  return ArrayOfPatientsFullNames;
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
        `${transaction.description}: ${transaction.amount}dt`
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

function getMedicalFileById(medicalFilesList, id) {
  let matchedMedicalFile = {
    title: "N/A",
    amount: "ID not found",
    customFields: null,
    description: "N/A",
  };
  medicalFilesList.map((currentMedicalFile) => {
    if (currentMedicalFile._id === id) {
      matchedMedicalFile = {
        amount: currentMedicalFile.amount,
        title: currentMedicalFile.title,
        customFields: currentMedicalFile.customFields,
        description: currentMedicalFile.description,
      };
    }
  });
  return matchedMedicalFile;
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

function sendDownloadEvent(ids, data) {
  ipcRenderer.send("download", filterDataFromIds(data, ids));
}

async function getUserIdEvent() {
  ipcRenderer.send("getUserId");
  ipcRenderer.on("getUserIdResponse", (event, userId) => {
    console.log(`User ID: ${userId}`);
    return userId;
  });
}

function setUserIdEvent(id) {
  ipcRenderer.send("setUserId", id);
}

function hoursAgo(dateStr) {
  var date = new Date(dateStr);
  var now = new Date();
  var diffMs = now - date;
  var diffDays = Math.floor(diffMs / 86400000); // 86400000 = 1000 * 60 * 60 * 24
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // 3600000 = 1000 * 60 * 60
  var result = "";
  if (diffDays > 0) {
    result += diffDays + "d ";
  }
  result += diffHrs + "hr ago";
  return result;
}

function addStringToArray(arr, str) {
  arr.push(str);
  return arr;
}

function removeStringFromArray(arr, str) {
  const index = arr.indexOf(str);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export {
  getSelectedPatientsEmails,
  getPatientsFullNames,
  generateTransactionsTypeStype,
  parseDateString,
  getSelectedTransactionsIdsAmount,
  getTransactionById,
  filterDataFromIds,
  sendDownloadEvent,
  hoursAgo,
  getMedicalFileById,
  addStringToArray,
  removeStringFromArray,
  getUserIdEvent,
  setUserIdEvent,
};
