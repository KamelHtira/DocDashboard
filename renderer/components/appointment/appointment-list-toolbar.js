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
import { createContext, useState } from "react";
import { Download as DownloadIcon } from "../../icons/download";
import { Search as SearchIcon } from "../../icons/search";
import { Upload as UploadIcon } from "../../icons/upload";
import { AddAppointmentPopup } from "./add-appointment-popup";

export const AddAppointmentsPopupContext = createContext(null);

export const AppointmentListToolbar = (props) => {
  // Set "show" variable for AddAppointmentPopup
  const [showAddAppointmentsPopup, setShowAddAppointmentsPopup] =
    useState(false);
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
          Appointments
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button color="primary" variant="contained" onClick={()=>{setShowAddAppointmentsPopup(true)}}>
            Add appointment
          </Button>
          <AddAppointmentsPopupContext.Provider
          value={{
            showAddAppointmentsPopup,
            setShowAddAppointmentsPopup
          }}>
            <AddAppointmentPopup />
          </AddAppointmentsPopupContext.Provider>
        </Box>
      </Box>
      {/* <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon
                      fontSize="small"
                      color="action"
                    >
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              placeholder="Search appointment"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    </Box> */}
    </Box>
  );
};
