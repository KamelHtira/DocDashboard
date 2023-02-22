import Head from "next/head";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Google as GoogleIcon } from "../icons/google";
import { useEffect, useState } from "react";
import { backendURL } from "../utils/constants";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  //-------------------------------
  const [checkServerState, setcheckServerState] = useState({
    response: "Checking Server State.. ",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendURL}/`);
        const data = await res.json();
        setcheckServerState(data);
      } catch (error) {
        setcheckServerState("ERROR while connecting to server");
      }
    };
    fetchData();
  }, []);
  //-------------------------------
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "hedihmida2@gmail.com",
      password: "1234",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async () => {
      //send a post request with the login data to the server
      try {
        const body = JSON.stringify({
          email: formik.values.email,
          password: formik.values.password,
        });
        const data = await fetch(`${backendURL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
        });
        const response = await data.json();
        console.log(response);
        setErrorMsg(response.msg)
        if (data.ok) {
          router.push("/");
        } else {
          
        }
        
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                Sign in
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Sign in on the internal platform
              </Typography>
            </Box>

            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                color="error"
                startIcon={<GoogleIcon />}
                onClick={formik.handleSubmit}
                size="large"
                variant="contained"
              >
                Login with Google
              </Button>
            </Grid>

            <Box
              sx={{
                pb: 1,
                pt: 3,
              }}
            >
              <Typography align="center" color="textSecondary" variant="body1">
                or login with email address
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In Now
              </Button>
            </Box>
            <Typography color={errorMsg!="Login successful"?"error":"success.main"} variant="body1" align="center">
              {errorMsg}
            </Typography>
          </form>
          {checkServerState.response}
        </Container>
      </Box>
    </>
  );
};

export default Login;
