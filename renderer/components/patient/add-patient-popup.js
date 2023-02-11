import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  FormControl,
  Select,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { PatientsContext } from "../../pages/patients";
import { AddPatientsPopupContext } from "./patient-list-toolbar";
import * as Yup from "yup";

// [Will be moved]
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export const AddPatientPopup = () => {
  /* [ContextAPI]
    getter and setter for dependency value to refresh component after request sent
   */
  const { dependencyValue, setDependencyValue } = useContext(PatientsContext);

  /* [ContextAPI]
   getter and setter for "show" variable to handle closing and opening AddPatientPopup from PatientListToolbar
  */
  const { showAddPatientsPopup, setShowAddPatientsPopup } = useContext(
    AddPatientsPopupContext
  );

  const [addPatientResponseUI, setAddPatientResponseUI] = useState({
    message: "",
    color: "",
    display: "none",
  });
  function showAddPatientResponseUI(message, firstName, lastName) {
    if (message == "reset") {
      setAddPatientResponseUI({
        display: "none",
        message: "",
        color: "",
      });
    } else if (message=="success") {
      setAddPatientResponseUI({
        message: `Patient ${firstName} ${lastName} added succefully`,
        color: "success.main",
        display: "block",
      });
    } else {
      setAddPatientResponseUI({
        message: `${message}`,
        color: "error",
        display: "block",
      });

    }
  }

  // Add Request
  async function addPatientAPI(data) {
    try {
      const body = JSON.stringify(data);
      const res = await fetch(
        `https://shy-pear-catfish-cap.cyclic.app/patients`,
        {
          method: "POST",
          headers: { "content-Type": "application/json" },
          body: body,
        }
      );
      if (res.ok) {
        const json = await res.json();

        // Refresh list
        setDependencyValue(!dependencyValue);

        // Reset form
        formik.resetForm();

        // show success message
        showAddPatientResponseUI("success", json.firstName, json.lastName);
      } else {
        // show error message
        showAddPatientResponseUI("Iternal Server error 501", null, null);
        throw new Error(`Failed to add patient: ${res.statusText}`);
      }
    } catch (err) {
      showAddPatientResponseUI("ERROR while adding patient : Check internet connection", null, null);
      console.error(err);
    }
  }

  // [Formik] add patient
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      address: "",
      phone: "",
      sexe: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      firstName: Yup.string().max(255).required("First Name is required"),
      lastName: Yup.string().max(255).required("Last Name is required"),
      age: Yup.number(),
      sexe: Yup.string().required("sexe is required"),
    }),
    onSubmit: () => {
      const body = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.email,
        age: formik.values.age,
        address: formik.values.address,
        phone: formik.values.phone,
      };
      addPatientAPI(body);
    },
  });

  return (
    <Modal
      open={showAddPatientsPopup}
      onClose={() => {
        showAddPatientResponseUI("reset", null, null);
        formik.resetForm();
        setShowAddPatientsPopup(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Patient
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            size="small"
            error={Boolean(formik.touched.firstName && formik.errors.firstName)}
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
          <TextField
            size="small"
            error={Boolean(formik.touched.lastName && formik.errors.lastName)}
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
          <TextField
            size="small"
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
          <TextField
            size="small"
            error={Boolean(formik.touched.age && formik.errors.age)}
            fullWidth
            helperText={formik.touched.age && formik.errors.age}
            label="Age"
            margin="normal"
            name="age"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.age}
            variant="outlined"
          />

          <FormControl margin="normal" fullWidth>
            <InputLabel size="small" id="demo-simple-select-label">
              Sexe
            </InputLabel>
            <Select
              size="small"
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
          <TextField
            size="small"
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
          <TextField
            size="small"
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

          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Add patient
            </Button>

            {addPatientResponseUI.display == "block" ? (
              <Typography color={addPatientResponseUI.color} align="center">
                <br></br>
                {addPatientResponseUI.message}
              </Typography>
            ) : (
              ""
            )}
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
