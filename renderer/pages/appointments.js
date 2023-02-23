import Head from "next/head";
import { DashboardLayout } from "../components/dashboard-layout";
import { Box, Container } from "@mui/material";
import { AppointmentListResults } from "../components/appointment/appointment-list-results";
import { AppointmentListToolbar } from "../components/appointment/appointment-list-toolbar";
import { createContext, useState, useEffect } from "react";
import { appointmentIsLoading, backendURL } from "../utils/constants";

export const AppointmentsContext = createContext(null);
const Appointment = () => {
  // Create Dependency value to refresh list
  const [dependencyValue, setDependencyValue] = useState(1);

  // Fetch appointments data
  const [appointmentsList, setAppointmentsList] = useState([
    appointmentIsLoading,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAppointmentsList([appointmentIsLoading]);
        const res = await fetch(`${backendURL}/appointments`);
        const data = await res.json();
        setAppointmentsList(data);
        
        console.log(data);
      } catch (error) {
        setAppointmentsList([
          {
            type: "N/A",
          },
        ]);
      }
    };
    fetchData();
  }, [dependencyValue]);

  return (
    <>
      <Head>
        <title>Appointment | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <AppointmentsContext.Provider
            value={{ dependencyValue, setDependencyValue, appointmentsList }}
          >
            <AppointmentListToolbar />
            <br></br>
            <AppointmentListResults />
          </AppointmentsContext.Provider>
        </Container>
      </Box>
    </>
  );
};

Appointment.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Appointment;
