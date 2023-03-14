import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Divider,
} from "@mui/material";

import { useContext, useEffect, useState } from "react";
import { AppointmentsContext } from "../../pages/appointments";
import { backendURL, style } from "../../utils/constants";
import { PaidAppointmentsPopupContext } from "./appointment-list-results";
import { Grid } from "@material-ui/core";

export const PaidAppointmentPopup = ({ appointment }) => {
  // set Disabled submit button
  const [submitButton, setSubmitButton] = useState(false);

  /* [ContextAPI]
    getter and setter for dependency value to refresh component after request sent
   */
  const { dependencyValue, setDependencyValue, enqueueSnackbar } =
    useContext(AppointmentsContext);

  /* [ContextAPI]
   getter and setter for "show" variable to handle closing and opening PaidAppointmentPopup from AppointmentListToolbar
  */
  const { showPaidAppointmentsPopup, setShowPaidAppointmentsPopup } =
    useContext(PaidAppointmentsPopupContext);

  // Custom fields
  const [customFields, setCustomFields] = useState([]);

  // MedicalFile inputs values
  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    patientId: appointment.patientId,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${backendURL}/users/customFields/${
            localStorage.getItem("currentUser").split("-")[0]
          }`
        );
        if (res.ok) {
          const data = await res.json();
          setCustomFields(data.customFields);
          const newValues = { ...values };
          data.forEach((field) => {
            newValues.customFields[field] = "";
          });
          setValues(newValues);
        } else {
          throw new Error("error getting customFields");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Set Paid Request
  async function setPaidAppointmentAPI() {
    try {
      setSubmitButton(true);
      let customFieldsData = {};
      customFields.map((field) => {
        customFieldsData[field] = values[field];
      });
      const medicalFile = JSON.stringify({
        title: values.title,
        description: values.description,
        amount: values.amount,
        patientId: values.patientId,
        customFields: customFieldsData,
      });
      const appointmentUpdatedFields = JSON.stringify({
        isPaid: true,
        amount: values.amount,
      });
      const resApp = await fetch(
        `${backendURL}/appointments/${appointment._id}`,
        {
          method: "PATCH",
          headers: { "content-Type": "application/json" },
          body: appointmentUpdatedFields,
        }
      );
      if (resApp.ok) {
        const resMF = await fetch(`${backendURL}/medicalFiles`, {
          method: "POST",
          headers: { "content-Type": "application/json" },
          body: medicalFile,
        });
        enqueueSnackbar("Appointment Paid", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        if (resMF.ok) {
          enqueueSnackbar("MedicalFile added successfully", {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
          setSubmitButton(false);
          setShowPaidAppointmentsPopup(false);
        } else {
          throw new Error(`medicalFile`);
        }
        // Refresh list
        setDependencyValue(!dependencyValue);

        // show success message
      } else {
        // show error message
        throw new Error(`appointment`);
      }
    } catch (err) {
      enqueueSnackbar("ERROR adding" + err, {
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
    <Modal
      open={showPaidAppointmentsPopup}
      onClose={() => {
        setShowPaidAppointmentsPopup(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, width: "600px" }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Paid Appointment
        </Typography>
        <form>
          <Grid style={{ marginTop: "20px" }} container spacing={3}>
            <Grid item xs={6}>
              <TextField
                size="small"
                fullWidth
                label="Title"
                name="title"
                variant="outlined"
                required
                value={values.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                fullWidth
                label="Amount"
                name="amount"
                variant="outlined"
                type={"number"}
                required
                value={values.amount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Description"
                name="description"
                variant="outlined"
                multiline
                rows={3}
                value={values.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider textAlign="center">Custom informations</Divider>
            </Grid>
            {customFields
              ? customFields.map((field, index) => (
                  <Grid key={index} item xs={6}>
                    <TextField
                      size="small"
                      fullWidth
                      label={field}
                      name={field}
                      variant="outlined"
                      value={values.customFields}
                      onChange={handleChange}
                    />
                  </Grid>
                ))
              : "nothing here"}
          </Grid>

          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              fullWidth
              size="large"
              variant="contained"
              onClick={() => {
                setPaidAppointmentAPI();
              }}
              disabled={submitButton}
            >
              Finish appointment
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
