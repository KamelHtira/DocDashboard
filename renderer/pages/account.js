import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { AccountProfileDetails } from "../components/account/account-profile-details";
import { DashboardLayout } from "../components/dashboard-layout";
import { SettingsPassword } from "../components/account/settings-password";
import { AccountProfile } from "../components/account/account-profile";
import { createContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { ipcRenderer } from "electron";

export const AccountContext = createContext(null);

const Account = () => {
  // Provide SnackBar function
  const { enqueueSnackbar } = useSnackbar();
  const [userId, setUserId] = useState("");
  useEffect(() => {
    ipcRenderer.send("getUserId");
    ipcRenderer.on("getUserIdResponse", (event, userId) => {
      setUserId(userId);
    });
  }, []);
  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <AccountContext.Provider
          value={{
            enqueueSnackbar,
            userId
          }}
        >
          <Container maxWidth="lg">
            <Typography sx={{ mb: 3 }} variant="h4">
              Account
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AccountProfileDetails />
              </Grid>
              <Grid item xs={8}>
                <SettingsPassword  />
              </Grid>
              <Grid item xs={4}>
                <AccountProfile  />
              </Grid>
            </Grid>
          </Container>
        </AccountContext.Provider>
      </Box>
    </>
  );
};
Account.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Account;
