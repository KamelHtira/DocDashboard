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
import { backendURL, patientIsLoading, patientNA } from "../../utils/constants";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { parseDateString } from "../../utils/functions";
import { useSnackbar } from "notistack";
import { MedicalFileListResults } from "../../components/medicalFile/medicalFile-list-results";

const AccountProfileDetails = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  // Back to patients page
  const router = useRouter();

  // Get current patient data
  const [currentPatient, setCurrentPatient] = useState(patientIsLoading);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCurrentPatient(patientIsLoading);
        const res = await fetch(`${backendURL}/patients/${router.query.id}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentPatient(data);
          console.log(data);
        } else {
          throw new Error("error getting patient");
        }
      } catch (error) {
        setCurrentPatient(patientNA);
      }
    };
    fetchData();
  }, []);

  // Edit Request
  async function editPatientAPI(data) {
    try {
      const body = JSON.stringify(data);
      const data = await fetch(`${backendURL}/patients/${router.query.id}`, {
        method: "PATCH",
        headers: { "content-Type": "application/json" },
        body: body,
      });
      if (data.ok) {
        formik.setSubmitting(false);
        // show success message
        enqueueSnackbar(`Patient Edited Successfully`, {
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
      enqueueSnackbar(`ERROR Editing Patient`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.error(err);
    }
  }

  // [Formik] edit patient
  const formik = useFormik({
    initialValues: currentPatient,
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      firstName: Yup.string().max(255).required("First Name is required"),
      lastName: Yup.string().max(255).required("Last Name is required"),
      birthday: Yup.date().transform(parseDateString),
      sexe: Yup.string().required("sexe is required"),
    }),
    onSubmit: () => {
      const body = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.email,
        birthday: formik.values.birthday,
        address: formik.values.address,
        phone: formik.values.phone,
        sexe: formik.values.sexe,
      };
      editPatientAPI(body);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card style={{ margin: "20px 70px" }}>
          <CardHeader
            title={"Edit Patient " + router.query.id}
            align="center"
          />
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
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
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
                <TextField
                  size="meduim"
                  error={Boolean(
                    formik.touched.birthday && formik.errors.birthday
                  )}
                  fullWidth
                  helperText={formik.touched.birthday && formik.errors.birthday}
                  label="Last name"
                  margin="normal"
                  name="birthday"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.birthday}
                  variant="outlined"
                />
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
                    value={formik.values.sexe || "H"}
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
                  error={Boolean(
                    formik.touched.address && formik.errors.address
                  )}
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
              Save patient
            </Button>
          </Box>
        </Card>
      </form>
      <MedicalFileListResults patientId={router.query.id} />
    </>
  );
};
AccountProfileDetails.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default AccountProfileDetails;
