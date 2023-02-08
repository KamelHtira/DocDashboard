import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Modal,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { PatientsContext } from "../../pages/patients";
import { DeletePatientsPopupContext } from "./patient-list-toolbar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

function getSelectedPatientsEmails(patientsList,selectedPatientIds) {
  let ArrayOfSelectedPatientEmails = [];
  patientsList.map((patient) => {
    if (selectedPatientIds.includes(patient._id)) {
      ArrayOfSelectedPatientEmails.push(patient.email);
    }
  });
  return ArrayOfSelectedPatientEmails;
}

export const DeletePatientPopup = () => {
  // [ContextAPI] Get "selectedPatientIds" and patientsList
  const {
    selectedPatientIds,
    patientsList,
    dependencyValue,
    setDependencyValue,
  } = useContext(PatientsContext);

  // [ContextAPI] Get "show" state and setState
  const { showDeletePatientsPopup, setShowDeletePatientsPopup } = useContext(
    DeletePatientsPopupContext
  );

  // Delete Request
  async function deleteSelectedPatients() {
    try {
      const body = JSON.stringify({
        patientIds: selectedPatientIds,
      });
      const data = await fetch(
        `https://shy-pear-catfish-cap.cyclic.app/patients`,
        {
          method: "DELETE",
          headers: { "content-Type": "application/json" },
          body: body,
        }
      ).then((res) => {
        res.json();
        setDependencyValue(dependencyValue + 1);
      });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Modal
      open={showDeletePatientsPopup}
      onClose={() => setShowDeletePatientsPopup(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Delete Patient
        </Typography>
        <br></br>

        {
          // check patients before delete
          selectedPatientIds[0] == null ? (
            "\n No patients selected \n\n "
          ) : (
            <div>
              {" "}
              Are you sure you want to delete those Patients? <br></br>
              <br></br>
              {selectedPatientIds &&
                getSelectedPatientsEmails(patientsList,selectedPatientIds).map((patientEmail, key) => (
                  <div key={key}>
                    {patientEmail}
                    <br></br>
                  </div>
                ))}
            </div>
          )
        }

        <Typography align="center">
          <br></br>
          {selectedPatientIds[0] == null ? (
            <Button
              onClick={() => {
                setShowDeletePatientsPopup(false);
              }}
              variant="contained"
            >
              Ok
            </Button>
          ) : (
            <Button
              onClick={() => {
                deleteSelectedPatients();
                setShowDeletePatientsPopup(false);
              }}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          )}
        </Typography>
      </Box>
    </Modal>
  );
};