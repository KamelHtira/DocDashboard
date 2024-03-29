import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  FormControl,
  Select,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { DashboardLayout } from "../../components/dashboard-layout";
import { useFormik } from "formik";
import { backendURL } from "../../utils/constants";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { parseDateString } from "../../utils/functions";
import { useSnackbar } from "notistack";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useState } from "react";

const AccountProfileDetails = (props) => {
  // SnackBar
  const { enqueueSnackbar } = useSnackbar();

  // Back to patients page
  const router = useRouter();

  // Date picker
  const [valueBirthday, setValueBirthday] = useState(
    moment(new Date()).format("l")
  );

  // Add Request
  async function addPatientAPI(data) {
    try {
      const body = JSON.stringify(data);
      const res = await fetch(`${backendURL}/patients`, {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: body,
      });
      if (res.ok) {
        // Reset form
        formik.resetForm();

        // show success message
        enqueueSnackbar(`Patient Added Successfully`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        throw new Error(`Failed to add patient`);
      }
    } catch (err) {
      enqueueSnackbar(`ERROR Adding Patient`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.error(err);
    }
  }

  // [Formik] add patient
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      phone: "",
      sexe: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255),
      firstName: Yup.string().max(255).required("First Name is required"),
      lastName: Yup.string().max(255).required("Last Name is required"),
      sexe: Yup.string().required("sexe is required"),
    }),
    onSubmit: () => {
      const body = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.email,
        birthday: valueBirthday,
        address: formik.values.address,
        phone: formik.values.phone,
        sexe: formik.values.sexe,
      };
      addPatientAPI(body);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card style={{ margin: "20px 70px" }}>
        <CardHeader title="Add Patient" align="center" />
        <Divider />
        <CardContent style={{ margin: "0 19%" }}>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <TextField
                size="meduim"
                error={Boolean(
                  formik.touched.firstName && formik.errors.firstName
                )}
                fullWidth
                helperText={formik.touched.firstName && formik.errors.firstName}
                label="First name"
                margin="normal"
                name="firstName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                size="meduim"
                error={Boolean(
                  formik.touched.lastName && formik.errors.lastName
                )}
                fullWidth
                helperText={formik.touched.lastName && formik.errors.lastName}
                label="Last name"
                margin="normal"
                name="lastName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DesktopDatePicker
                  label="Birthday"
                  value={valueBirthday}
                  onChange={(newValue) => {
                    setValueBirthday(moment(newValue).format("l"));
                  }}
                  renderInput={(params) => (
                    <TextField fullWidth margin="normal" {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item md={8} xs={12}>
              <TextField
                size="meduim"
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email"
                margin="normal"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                variant="outlined"
              />
            </Grid>

            <Grid item md={4} xs={12}>
              <FormControl margin="normal" fullWidth>
                <InputLabel size="meduim" id="demo-simple-select-label">
                  Sexe
                </InputLabel>
                <Select
                  size="meduim"
                  error={Boolean(formik.touched.sexe && formik.errors.sexe)}
                  fullWidth
                  label="Sexe"
                  name="sexe"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.sexe}
                  variant="outlined"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                >
                  <MenuItem value={"H"}>Homme</MenuItem>
                  <MenuItem value={"F"}>Femme</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                size="meduim"
                error={Boolean(formik.touched.address && formik.errors.address)}
                fullWidth
                helperText={formik.touched.address && formik.errors.address}
                label="Address"
                margin="normal"
                name="address"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                size="meduim"
                error={Boolean(formik.touched.phone && formik.errors.phone)}
                fullWidth
                helperText={formik.touched.phone && formik.errors.phone}
                label="Phone"
                margin="normal"
                name="phone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone}
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
              router.push("/patients");
            }}
            variant="contained"
            sx={{
              background: "#9CA3AF",
              "&:hover": {
                background: "#6B7280",
              },
            }}
          >
            Back to patients
          </Button>
          <Button
            style={{ marginLeft: "20px" }}
            disabled={formik.isSubmitting}
            type="submit"
            variant="contained"
          >
            Add patient
          </Button>
        </Box>
      </Card>
    </form>
  );
};
AccountProfileDetails.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default AccountProfileDetails;
