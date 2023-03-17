import { useContext, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";
import { AccountContext } from "../../pages/account";
import { backendURL } from "../../utils/constants";

export const SettingsPassword = (props) => {
  /* [ContextAPI]
      Get snackbar function
     */
  const { enqueueSnackbar, userId } = useContext(AccountContext);

  // set Disabled submit button
  const [submitButton, setSubmitButton] = useState(false);

  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // Edit Request
  async function editPasswordAPI() {
    try {
      if (values.confirmNewPassword != values.newPassword) {
        return enqueueSnackbar(`Please Match Password `, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
      setSubmitButton(true);
      const body = JSON.stringify(values);
      const data = await fetch(`${backendURL}/password/${userId}`, {
        method: "PATCH",
        headers: { "content-Type": "application/json" },
        body: body,
      });
      if (data.ok) {
        setSubmitButton(false);
        // show success message
        enqueueSnackbar(`Password Edited Successfully`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        setValues({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setSubmitButton(false);
        throw new Error(`Failed to add password`);
      }
    } catch (err) {
      enqueueSnackbar(`ERROR Editing Password`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.error(err);
    }
  }

  return (
    <form {...props}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                margin="normal"
                name="currentPassword"
                onChange={handleChange}
                type="password"
                value={values.currentPassword}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm password"
                margin="normal"
                name="newPassword"
                onChange={handleChange}
                type="password"
                value={values.newPassword}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm password"
                margin="normal"
                name="confirmNewPassword"
                onChange={handleChange}
                type="password"
                value={values.confirmNewPassword}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button
            onClick={() => {
              editPasswordAPI();
            }}
            disabled={submitButton}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};
