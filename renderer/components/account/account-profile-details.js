import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { accountIsLoading, accountNA, backendURL } from "../../utils/constants";
import { AccountContext } from "../../pages/account";

const states = [
  {
    value: "ariana",
    label: "Ariana",
  },
  {
    value: "sousse",
    label: "Sousse",
  },
  {
    value: "sfax",
    label: "Sfax",
  },
  {
    value: "tunis",
    label: "Tunis",
  },
];

export const AccountProfileDetails = (props) => {
  /* [ContextAPI]
      Get snackbar function
     */
  const { enqueueSnackbar } = useContext(AccountContext);

  // set Disabled submit button
  const [submitButton, setSubmitButton] = useState(false);

  // Get current account data
  const [currentAccount, setCurrentAccount] = useState(accountIsLoading);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSubmitButton(true);
        const res = await fetch(
          `${backendURL}/users/${
            localStorage.getItem("currentUser").split("-")[0]
          }`
        );
        if (res.ok) {
          setSubmitButton(false);
          const data = await res.json();
          setCurrentAccount(data);
          console.log(data);
        } else {
          setSubmitButton(false);
          throw new Error("error getting account");
        }
      } catch (error) {
        setCurrentAccount(accountNA);
      }
    };
    fetchData();
  }, []);

  // Edit Request
  async function editAccountAPI() {
    try {
      setSubmitButton(true);
      const body = JSON.stringify(currentAccount);
      const data = await fetch(
        `${backendURL}/users/${
          localStorage.getItem("currentUser").split("-")[0]
        }`,
        {
          method: "PATCH",
          headers: { "content-Type": "application/json" },
          body: body,
        }
      );
      if (data.ok) {
        setSubmitButton(false);
        // show success message
        enqueueSnackbar(`Account Edited Successfully`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        setSubmitButton(false);
        throw new Error(`Failed to add account`);
      }
    } catch (err) {
      enqueueSnackbar(`ERROR Editing Account`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.error(err);
    }
  }

  const handleChange = (event) => {
    setCurrentAccount({
      ...currentAccount,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={currentAccount.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={currentAccount.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={currentAccount.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                value={currentAccount.phone}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                //onChange={handleChange}
                required
                value={"Tunisia"}
                //value={currentAccount.country}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Select State"
                name="state"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={currentAccount.state}
                variant="outlined"
              >
                {states.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
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
            color="primary"
            disabled={submitButton}
            onClick={() => {
              editAccountAPI();
            }}
            variant="contained"
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};
