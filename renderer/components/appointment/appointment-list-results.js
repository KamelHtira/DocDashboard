import { Box, Grid, Tabs, Tab } from "@mui/material";
import { useContext, useState } from "react";
import { AppointmentCardConfirmed } from "./appointment-card-confirmed";
import PropTypes from "prop-types";
import { AppointmentCardPending } from "./appointment-card-pending";
import { AppointmentCardQueue } from "./appointment-card-queue";
import { AppointmentsContext } from "../../pages/appointments";
import { createContext } from "react";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export const PaidAppointmentsPopupContext = createContext(null);

export const AppointmentListResults = (props) => {
  // Set "show" variable for PaidAppointmentPopup
  const [showPaidAppointmentsPopup, setShowPaidAppointmentsPopup] =
    useState(false);

  const { appointmentsList } = useContext(AppointmentsContext);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Directe" {...a11yProps(0)} />
          <Tab label="Confirmee" {...a11yProps(1)} />
          <Tab label="Demande" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <PaidAppointmentsPopupContext.Provider
        value={{ showPaidAppointmentsPopup, setShowPaidAppointmentsPopup }}
      >
        <TabPanel value={value} index={0}>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {appointmentsList.map(
                (appointment, index) =>
                  appointment.type == "Q" &&
                  !appointment.isPaid && (
                    <Grid key={index} item lg={4} md={6} xs={12}>
                      <AppointmentCardQueue appointment={appointment} />
                    </Grid>
                  )
              )}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {appointmentsList.map(
                (appointment, index) =>
                  appointment.type == "C" && (
                    <Grid key={index} item lg={4} md={6} xs={12}>
                      <AppointmentCardConfirmed appointment={appointment} />
                    </Grid>
                  )
              )}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {appointmentsList.map(
                (appointment, index) =>
                  appointment.type == "P" && (
                    <Grid key={index} item lg={4} md={6} xs={12}>
                      <AppointmentCardPending appointment={appointment} />
                    </Grid>
                  )
              )}
            </Grid>
          </Box>
        </TabPanel>
      </PaidAppointmentsPopupContext.Provider>
    </>
  );
};
