import Head from "next/head";
import { Box, Container } from "@mui/material";
import { PatientListResults } from "../components/patient/patient-list-results";
import { PatientListToolbar } from "../components/patient/patient-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { customers } from "../__mocks__/customers";
import { createContext, useState, useEffect } from "react";

export const PatientsContext = createContext(null);

const isLoading = {
  firstName: "loading..",
  lastName: "",
  address: "loading..",
  age: "loading..",
  email: "loading..",
  phone: "loading",
};
const Customers = () => {
  // Dependency value
  const [dependencyValue, setDependencyValue] = useState(1);

  // Selected patients ids
  const [selectedPatientIds, setSelectedPatientIds] = useState([]);

  // Fetch patients data
  const [patientsList, setPatientsList] = useState([isLoading]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPatientsList([isLoading]);
        const res = await fetch(
          "https://shy-pear-catfish-cap.cyclic.app/patients"
        );
        const data = await res.json();
        setPatientsList(data);
      } catch (error) {
        setPatientsList([
          {
            firstName: "N/A",
            lastName: "",
            address: "N/A",
            age: "N/A",
            email: "N/A",
            phone: "N/A",
          },
        ]);
      }
    };
    fetchData();
  }, [dependencyValue]);

  return (
    <>
      <Head>
        <title>Customers | Material Kit</title>
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
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
