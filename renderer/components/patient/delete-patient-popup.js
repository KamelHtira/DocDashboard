import {
  Box,
  Button,
  Typography,
  Modal,
} from "@mui/material";
import { useContext } from "react";
import { PatientsContext } from "../../pages/patients";
import { DeletePatientsPopupContext } from "./patient-list-toolbar";

// [Will be moved]
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

// [Will be moved]
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
  /* [ContextAPI]
   "selectedPatientIds" send delete requests
   "patientsList" to get mails 
    getter and setter for dependency value to refresh component after request sent
   */
  const {
    selectedPatientIds,
    patientsList,
    dependencyValue,
    setDependencyValue,
  } = useContext(PatientsContext);

  /* [ContextAPI]
   getter and setter for "show" variable to handle closing and opening DeletePatientPopup from PatientListToolbar
  */
  const { showDeletePatientsPopup, setShowDeletePatientsPopup } = useContext(
    DeletePatientsPopupContext
  );

  // Delete Request
  async function deleteSelectedPatientsAPI() {
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
        setDependencyValue(!dependencyValue);
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
                deleteSelectedPatientsAPI();
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
