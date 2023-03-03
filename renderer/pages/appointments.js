import Head from "next/head";
import { DashboardLayout } from "../components/dashboard-layout";
import { Box, Container } from "@mui/material";
import { AppointmentListResults } from "../components/appointment/appointment-list-results";
import { AppointmentListToolbar } from "../components/appointment/appointment-list-toolbar";
import { createContext, useState, useEffect } from "react";
import { appointmentIsLoading, backendURL } from "../utils/constants";
import { useSnackbar } from "notistack";

export const AppointmentsContext = createContext(null);
const Appointment = () => {
  // Provide SnackBar function
  const { enqueueSnackbar } = useSnackbar();

  // Create Dependency value to refresh list
  const [dependencyValue, setDependencyValue] = useState(1);

  // Fetch appointments data
  const [appointmentsList, setAppointmentsList] = useState([
    appointmentIsLoading,
  ]);

  // Delete appointment API
  async function deleteAppointment(id) {
    try {
      const res = await fetch(`${backendURL}/appointments/${id}`, {
        method: "DELETE",
        headers: { "content-Type": "application/json" },
      });
      if (res.ok) {
        setDependencyValue(!dependencyValue);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Edit appointment API
  async function EditAppointmentType(id, type) {
    try {
      const res = await fetch(`${backendURL}/appointments/${id}`, {
        method: "PATCH",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({
          type: type,
        }),
      });
      if (res.ok) {
        setDependencyValue(!dependencyValue);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setAppointmentsList(appointmentIsLoading);
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
            value={{
              dependencyValue,
              setDependencyValue,
              appointmentsList,
              deleteAppointment,
              EditAppointmentType,
              enqueueSnackbar,
            }}
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
