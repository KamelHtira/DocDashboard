import Head from "next/head";
import { DashboardLayout } from "../components/dashboard-layout";
import { Box, Container } from "@mui/material";
import { AppointmentListResults } from "../components/appointment/appointment-list-results";
import { AppointmentListToolbar } from "../components/appointment/appointment-list-toolbar";
import { createContext, useState, useEffect } from "react";
import { appointmentIsLoading, backendURL } from "../utils/constants";
import { useSnackbar } from "notistack";
import { ipcRenderer } from "electron";

export const AppointmentsContext = createContext(null);
const Appointment = () => {
  const [userId, setUserId] = useState("");

  // Provide SnackBar function
  const { enqueueSnackbar } = useSnackbar();

  // Create Dependency value to refresh list
  const [dependencyValue, setDependencyValue] = useState(1);

  // Fetch appointments data
  const [appointmentsList, setAppointmentsList] = useState(null);

  // Delete appointment API
  async function deleteAppointment(id) {
    try {
      const res = await fetch(`${backendURL}/appointments/${id}`, {
        method: "DELETE",
        headers: { "content-Type": "application/json" },
      });
      if (res.ok) {
        setDependencyValue(!dependencyValue);
        enqueueSnackbar(`Appointment Deleted`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
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
        enqueueSnackbar(
          `${
            type == "Q" ? "Moved To Live Queue ◉" : "Appointment Confirmed ❯"
          }`,
          {
            variant: "info",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          }
        );
        enqueueSnackbar(`Patient Added Successfully`, {
          variant: "info",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setAppointmentsList(null);
        const res = await fetch(`${backendURL}/appointments`);
        const data = await res.json();
        setAppointmentsList(data);
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
  useEffect(() => {
    ipcRenderer.send("getUserId");
    ipcRenderer.on("getUserIdResponse", (event, userId) => {
      setUserId(userId);
    });
  }, []);

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
              userId,
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
