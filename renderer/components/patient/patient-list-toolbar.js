import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "../../icons/search";
import { Download as DownloadIcon } from "../../icons/download";
import { DeletePatientPopup } from "./delete-patient-popup";
import { useState, createContext, useContext } from "react";
import { PatientsContext } from "../../pages/patients";
import { AddPatientPopup } from "./add-patient-popup";
import { ipcRenderer } from "electron";

export const DeletePatientsPopupContext = createContext(null);
export const AddPatientsPopupContext = createContext(null);

function downloadCSV() {
  try {
    ipcRenderer.send("download",{payload:{url:"https://shy-pear-catfish-cap.cyclic.app/download/patients?fileName=test.txt"}})
  } catch (error) {
    console.log(error);
  }
}

export const PatientListToolbar = (props) => {
  // Set "show" variable for DeletePatientPopup
  const [showDeletePatientsPopup, setShowDeletePatientsPopup] = useState(false);

  // Set "show" variable for DeletePatientPopup
  const [showAddPatientsPopup, setShowAddPatientsPopup] = useState(false);

  //test

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Patients
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button
            onClick={() => {
              downloadCSV();
            }}
            startIcon={<DownloadIcon fontSize="small" />}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setShowAddPatientsPopup(true);
            }}
          >
            Add Patients
          </Button>
          <AddPatientsPopupContext.Provider
            value={{
              showAddPatientsPopup,
              setShowAddPatientsPopup,
            }}
          >
            <AddPatientPopup />
          </AddPatientsPopupContext.Provider>

          <Button
            sx={{ marginLeft: "10px" }}
            color="error"
            variant="contained"
            onClick={() => {
              setShowDeletePatientsPopup(true);
            }}
          >
            Delete Patients
          </Button>
          <DeletePatientsPopupContext.Provider
            value={{
              showDeletePatientsPopup,
              setShowDeletePatientsPopup,
            }}
          >
            <DeletePatientPopup />
          </DeletePatientsPopupContext.Provider>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon color="action" fontSize="small">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search patient"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
