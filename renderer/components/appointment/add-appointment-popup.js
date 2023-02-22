import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  FormControl,
  Select,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { AppointmentsContext } from "../../pages/appointments";
import { AddAppointmentsPopupContext } from "./appointment-list-toolbar";
import { backendURL, style as s, style } from "../../utils/constants";
import * as Yup from "yup";
import { getPatientsFullNames, parseDateString } from "../../utils/functions";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { FormLabel, Grid } from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

export const AddAppointmentPopup = () => {
  // Radio Button value
  const [valueRadioButton, setValueRadioButton] = useState("exist");

  const handleChangeRadioButton = (event) => {
    setValueRadioButton(event.target.value);
  };

  // Consultaion Type value
  const [valueConsultation, setValueConsultation] = useState("Q");

  const handleChangeConsultation = (event) => {
    setValueConsultation(event.target.value);
    formik.values.type = event.target.value;
  };

  // Async AutoComplete
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${backendURL}/patients`);
        const data = await res.json();
        setOptions(data);
      } catch (error) {
        setOptions(["N/A"]);
      }
    };

    (async () => {
      if (active) {
        fetchData();
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  // Date&Time picker
  const [value, setValue] = useState(moment(new Date()));
  const handleChange = (newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  /* [ContextAPI]
      getter and setter for dependency value to refresh component after request sent
     */
  const { dependencyValue, setDependencyValue } =
    useContext(AppointmentsContext);

  /* [ContextAPI]
     getter and setter for "show" variable to handle closing and opening AddAppointmentPopup from AppointmentListToolbar
    */
  const { showAddAppointmentsPopup, setShowAddAppointmentsPopup } = useContext(
    AddAppointmentsPopupContext
  );

  const [addAppointmentResponseUI, setAddAppointmentResponseUI] = useState({
    message: "",
    color: "",
    display: "none",
  });

  // Handle appointment response message
  function showAddAppointmentResponseUI(message, firstName, lastName) {
    if (message == "reset") {
      setAddAppointmentResponseUI({
        display: "none",
        message: "",
        color: "",
      });
    } else if (message == "success") {
      setAddAppointmentResponseUI({
        message: `Appointment ${firstName} ${lastName} added succefully`,
        color: "success.main",
        display: "block",
      });
    } else {
      setAddAppointmentResponseUI({
        message: `${message}`,
        color: "error",
        display: "block",
      });
    }
  }

  // Add Request
  async function addAppointmentAPI(data) {
    try {
      const body = JSON.stringify(data);
      const res = await fetch(`${backendURL}/appointments`, {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: body,
      });
      if (res.ok) {
        const json = await res.json();

        // Refresh list
        setDependencyValue(!dependencyValue);

        // Reset form
        formik.resetForm();

        // show success message
        showAddAppointmentResponseUI("success", json.firstName, json.lastName);
      } else {
        // show error message
        showAddAppointmentResponseUI("Iternal Server error 501", null, null);
        throw new Error(`Failed to add appointment: ${res.statusText}`);
      }
    } catch (err) {
      showAddAppointmentResponseUI(
        "ERROR while adding appointment : Check internet connection",
        null,
        null
      );
      console.error(err);
    }
  }

  // [Formik] add appointment
  const formik = useFormik({
    initialValues: {
      amount: "",
      type: "",
      date: "",
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
      addAppointmentAPI(body);
    },
  });

  return (
    <Modal
      open={showAddAppointmentsPopup}
      onClose={() => {
        showAddAppointmentResponseUI("reset", null, null);
        formik.resetForm();
        setShowAddAppointmentsPopup(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, width: "600px" }}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          align="center"
          component="h2"
        >
          Rendez-vous
        </Typography>
        <br></br>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel size="small" id="demo-simple-select-label">
                  Type de consultation
                </InputLabel>
                <Select
                  size="small"
                  error={Boolean(formik.touched.type && formik.errors.type)}
                  label="Type de consultation"
                  name="type"
                  onBlur={formik.handleBlur}
                  onChange={handleChangeConsultation}
                  value={valueConsultation}
                  variant="outlined"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                >
                  <MenuItem value={"Q"}>Consultation Directe</MenuItem>
                  <MenuItem value={"C"}>Consultation Confirmee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                  disabled={valueConsultation == "Q" ? true : false}
                  label="Rendez-vous"
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField fullWidth size="small" {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                error={Boolean(
                  formik.touched.description && formik.errors.description
                )}
                fullWidth
                helperText={
                  formik.touched.description && formik.errors.description
                }
                label="Description"
                name="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description}
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <br></br>
          <Divider textAlign="center">Patient</Divider>
          <br></br>
          <Grid container spacing={3}>
            <Grid item xs={12} align="center">
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={valueRadioButton}
                  onChange={handleChangeRadioButton}
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="exist"
                    control={<Radio />}
                    label="Patient Existe"
                  />

                  <FormControlLabel
                    value="new"
                    control={<Radio />}
                    label="Nouveau Patient"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
              {valueRadioButton == "exist" ? (
                <Autocomplete
                  size="small"
                  id="asynchronous-demo"
                  sx={{ width: 300 }}
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.firstName + " " + option.lastName === value
                  }
                  getOptionLabel={(option) =>
                    option.firstName + " " + option.lastName
                  }
                  options={options}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chercher un patient.."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              ) : (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size="small"
                        error={Boolean(
                          formik.touched.date && formik.errors.date
                        )}
                        helperText={formik.touched.date && formik.errors.date}
                        label="Nom"
                        name="date"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.date}
                        variant="outlined"
                      ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size="small"
                        error={Boolean(
                          formik.touched.date && formik.errors.date
                        )}
                        helperText={formik.touched.date && formik.errors.date}
                        label="Prenom"
                        name="date"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.date}
                        variant="outlined"
                      ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size="small"
                        error={Boolean(
                          formik.touched.date && formik.errors.date
                        )}
                        helperText={formik.touched.date && formik.errors.date}
                        label="Naissance MM/DD/YYYY"
                        name="date"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.date}
                        variant="outlined"
                      ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel size="small" id="demo-simple-select-label">
                          Sexe
                        </InputLabel>
                        <Select
                          size="small"
                          error={Boolean(
                            formik.touched.sexe && formik.errors.sexe
                          )}
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
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          <br></br>
          <Box align="center" sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              sx={{ width: "50%" }}
              size="large"
              type="submit"
              variant="contained"
            >
              Add appointment
            </Button>

            {addAppointmentResponseUI.display == "block" ? (
              <Typography color={addAppointmentResponseUI.color} align="center">
                <br></br>
                {addAppointmentResponseUI.message}
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
