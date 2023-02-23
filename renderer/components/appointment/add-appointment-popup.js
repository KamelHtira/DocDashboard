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
  Checkbox,
  FormGroup,
  Grid,
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
import { parseDateString } from "../../utils/functions";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

export const AddAppointmentPopup = () => {
  // Radio Button value
  const [valueRadioButton, setValueRadioButton] = useState("exist");

  const handleChangeRadioButton = (event) => {
    setValueRadioButton(event.target.value);
  };

  // Radio Button value
  const [valueCheckBox, setValueCheckBox] = useState(true);

  const handleChangeCheckBox = (event) => {
    setValueCheckBox(!valueCheckBox);
  };

  // Consultaion Type value
  const [valueConsultation, setValueConsultation] = useState("Q");

  const handleChangeConsultation = (event) => {
    setValueConsultation(event.target.value);
    formik.values.type = event.target.value;
  };

  // Async AutoComplete
  const [open, setOpen] = useState(false);
  const [autoCompleteValue, setAutoCompleteValue] = useState(null);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const handleAutoCompleteValue = (event, value) => {
    setAutoCompleteValue(value);
  };
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

  // autoComplete fetch patient
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
      firstName: "",
      lastName: "",
      birthday: "",
      appointmentDate: value,
      description: "",
      phone: "",
      type: valueConsultation,
      sexe: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string(),
      lastName: Yup.string(),
      appointmentDate: Yup.date(),
      description: Yup.string(),
      birthday: Yup.date().transform(parseDateString),
      type: Yup.string().required("type is required"),
    }),
    onSubmit: () => {
      const body = {
        description: formik.values.description,
      };

      // add consultation type
      // Q : Queued Consultation without appointment date
      if (valueConsultation == "C") {
        body = {
          ...body,
          appointmentDate: moment(value).format(),
          type: valueConsultation,
        };
      } else {
        body = {
          ...body,
          appointmentDate:null,
          type: valueConsultation,
        };
      }

      if (valueRadioButton == "new") {
        body = {
          ...body,
          firstName: formik.values.firstName,
          lastName: formik.values.lastName,
          birthday: moment(formik.values.birthday).format(),
          sexe: formik.values.sexe,
        };
      } else if (valueRadioButton == "exist") {
        body = {
          ...body,
          firstName: autoCompleteValue.firstName,
          lastName: autoCompleteValue.lastName,
          birthday: moment(autoCompleteValue.birthday).format(),
          sexe: autoCompleteValue.sexe,
        };
      }
      console.log(autoCompleteValue);
      console.log(body);
      formik.setSubmitting(false);
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
                  getOptionLabel={(option) =>
                    option.firstName + " " + option.lastName
                  }
                  options={options}
                  loading={loading}
                  onChange={handleAutoCompleteValue}
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
                          formik.touched.firstName && formik.errors.firstName
                        )}
                        helperText={
                          formik.touched.firstName && formik.errors.firstName
                        }
                        label="Nom"
                        name="firstName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.firstName}
                        variant="outlined"
                      ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size="small"
                        error={Boolean(
                          formik.touched.lastName && formik.errors.lastName
                        )}
                        helperText={
                          formik.touched.lastName && formik.errors.lastName
                        }
                        label="Prenom"
                        name="lastName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.lastName}
                        variant="outlined"
                      ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size="small"
                        error={Boolean(
                          formik.touched.birthday && formik.errors.birthday
                        )}
                        helperText={
                          formik.touched.birthday && formik.errors.birthday
                        }
                        label="Date de Naissance"
                        name="birthday"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.birthday}
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
                    <Grid item xs={12}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked
                              onChange={handleChangeCheckBox}
                              value={valueCheckBox}
                            />
                          }
                          label="Ajouter cette patient au base de donnee"
                        />
                      </FormGroup>
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
