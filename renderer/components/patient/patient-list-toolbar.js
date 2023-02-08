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

export const DeletePatientsPopupContext = createContext(null);
export const AddPatientsPopupContext = createContext(null);

export const PatientListToolbar = (props) => {
  // Get selected patients and patients list
  const { selectedPatientIds, patientsList} = useContext(PatientsContext);

  // Set "show" delete popup value
  const [showDeletePatientsPopup, setShowDeletePatientsPopup] = useState(false);

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
          <Button startIcon={<DownloadIcon fontSize="small" />} sx={{ mr: 1 }}>
            Export
          </Button>
          <Button color="primary" variant="contained">
            Add Patients
          </Button>

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
            <DeletePatientPopup/>
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
