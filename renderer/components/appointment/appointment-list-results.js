import { Box, Grid, Tabs, Tab, Typography } from "@mui/material";
import { useState } from "react";
import { products } from "../../__mocks__/products";
import { AppointmentCardConfirmed } from "./appointment-card-confirmed";
import PropTypes from "prop-types";
import { AppointmentCardPending } from "./appointment-card-pending";
import { AppointmentCardQueue } from "./appointment-card-queue";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export const AppointmentListResults = (props) => {
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
      <TabPanel value={value} index={0}>
        <Box sx={{ pt: 3 }}>
          <Grid container spacing={3}>
          {products.map((appointment) => (
              appointment.type == "Q" ?
              <Grid item key={appointment.id} lg={4} md={6} xs={12}>
                <AppointmentCardQueue appointment={appointment} />
              </Grid>:""
            ))}
          </Grid>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {products.map((appointment) => (
              appointment.type == "C" ?
              <Grid item key={appointment.id} lg={4} md={6} xs={12}>
                <AppointmentCardConfirmed appointment={appointment} />
              </Grid>:""
            ))}
          </Grid>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box sx={{ pt: 3 }}>
          <Grid container spacing={3}>
          {products.map((appointment) => (
              appointment.type == "P" ?
              <Grid item key={appointment.id} lg={4} md={6} xs={12}>
                <AppointmentCardPending appointment={appointment} />
              </Grid>:""
            ))}
          </Grid>
        </Box>
      </TabPanel>
    </>
  );
};
