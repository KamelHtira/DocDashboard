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
import { AppointmentsContext } from "../../pages/appointments";
import { backendURL, style } from "../../utils/constants";
import * as Yup from "yup";
import { parseDateString } from "../../utils/functions";
import { PaidAppointmentsPopupContext } from "./appointment-list-results";

export const PaidAppointmentPopup = () => {
  /* [ContextAPI]
    getter and setter for dependency value to refresh component after request sent
   */
  const { dependencyValue, setDependencyValue } =
    useContext(AppointmentsContext);

  /* [ContextAPI]
   getter and setter for "show" variable to handle closing and opening PaidAppointmentPopup from AppointmentListToolbar
  */
  const { showPaidAppointmentsPopup, setShowPaidAppointmentsPopup } =
    useContext(PaidAppointmentsPopupContext);

  // Paid Request
  // async function paidAppointmentAPI(data) {
  //   try {
  //     const body = JSON.stringify(data);
  //     const res = await fetch(`${backendURL}/appointments`, {
  //       method: "POST",
  //       headers: { "content-Type": "application/json" },
  //       body: body,
  //     });
  //     if (res.ok) {
  //       const json = await res.json();

  //       // Refresh list
  //       setDependencyValue(!dependencyValue);

  //       // Reset form
  //       formik.resetForm();

  //       // show success message

  //     } else {
  //       // show error message

  //       throw new Error(`Failed to paid appointment: ${res.statusText}`);
  //     }
  //   } catch (err) {

  //     console.error(err);
  //   }
  // }

  // [Formik] paid appointment
  const formik = useFormik({
    initialValues: {
      amount: "",
      type: "",
      date: new Date().toLocaleDateString(),
      description: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number().required("Amount is required"),
      description: Yup.string(),
      date: Yup.date().transform(parseDateString),
      type: Yup.string().required("type is required"),
    }),
    onSubmit: () => {
      const body = {
        amount: formik.values.amount,
        description: formik.values.description,
        date: formik.values.date,
        type: formik.values.type,
      };
      //  paidAppointmentAPI(body);
    },
  });

  return (
    <Modal
      open={showPaidAppointmentsPopup}
      onClose={() => {
        formik.resetForm();
        setShowPaidAppointmentsPopup(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Paid Appointment
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            size="small"
            error={Boolean(formik.touched.amount && formik.errors.amount)}
            fullWidth
            helperText={formik.touched.amount && formik.errors.amount}
            label="Amount"
            margin="normal"
            name="amount"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.amount}
            variant="outlined"
          />
          <FormControl margin="normal" fullWidth>
            <InputLabel size="small" id="demo-simple-select-label">
              Type
            </InputLabel>
            <Select
              size="small"
              error={Boolean(formik.touched.type && formik.errors.type)}
              fullWidth
              label="Type"
              name="type"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.type}
              variant="outlined"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
            >
              <MenuItem value={"Income"}>Income</MenuItem>
              <MenuItem value={"Outcome"}>Outcome</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            error={Boolean(formik.touched.date && formik.errors.date)}
            fullWidth
            helperText={formik.touched.date && formik.errors.date}
            label="Date MM/DD/YYYY"
            margin="normal"
            name="date"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.date}
            variant="outlined"
          ></TextField>
          <TextField
            size="small"
            error={Boolean(
              formik.touched.description && formik.errors.description
            )}
            fullWidth
            helperText={formik.touched.description && formik.errors.description}
            label="Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            variant="outlined"
            multiline
            rows={3}
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
              Paid appointment
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
