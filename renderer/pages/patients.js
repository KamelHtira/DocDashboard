import Head from "next/head";
import { Box, Container } from "@mui/material";
import { PatientListResults } from "../components/patient/patient-list-results";
import { PatientListToolbar } from "../components/patient/patient-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { createContext, useState, useEffect } from "react";
import { patientIsLoading, backendURL, patientNA } from "../utils/constants";
import { useSnackbar } from "notistack";
export const PatientsContext = createContext(null);

const Patients = () => {
  // Provide SnackBar function
  const { enqueueSnackbar } = useSnackbar();

  // Create Dependency value to refresh list
  const [dependencyValue, setDependencyValue] = useState(1);

  // Create varibale to handle selected patients ids
  const [selectedPatientIds, setSelectedPatientIds] = useState([]);

  // Fetch patients data
  const [patientsList, setPatientsList] = useState([patientIsLoading]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPatientsList([patientIsLoading]);
        const res = await fetch(`${backendURL}/patients`);
        const data = await res.json();
        setPatientsList(data);
      } catch (error) {
        setPatientsList([patientNA]);
      }
    };
    fetchData();
  }, [dependencyValue]);

  return (
    <>
      <Head>
        <title>Patients</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <PatientsContext.Provider
            value={{
              patientsList,
              selectedPatientIds,
              setSelectedPatientIds,
              dependencyValue,
              setDependencyValue,
              enqueueSnackbar,
            }}
          >
            <PatientListToolbar />
            <Box sx={{ mt: 3 }}>
              <PatientListResults />
            </Box>
          </PatientsContext.Provider>
        </Container>
      </Box>
    </>
  );
};
Patients.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Patients;
