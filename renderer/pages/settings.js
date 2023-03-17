import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { SettingsNotifications } from "../components/settings/settings-notifications";
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";

const Settings = () => {
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
        <title>Settings | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Settings
          </Typography>
          <SettingsNotifications userId={userId}/>
        </Container>
      </Box>
    </>
  );
};

Settings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Settings;
