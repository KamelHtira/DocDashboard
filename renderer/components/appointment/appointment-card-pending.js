import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Clock as ClockIcon } from "../../icons/clock";
import PendingIcon from "@mui/icons-material/Pending";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { hoursAgo } from "../../utils/functions";
import moment from "moment";
import { useContext } from "react";
import { AppointmentsContext } from "../../pages/appointments";
import { backendURL } from "../../utils/constants";

export const AppointmentCardPending = ({ appointment, ...rest }) => {
  const { deleteAppointment, EditAppointmentType } =
    useContext(AppointmentsContext);
  async function addPatientAPI(data) {
    try {
      const body = JSON.stringify(data);
      const res = await fetch(`${backendURL}/patients`, {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: body,
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      {...rest}
    >
      <CardContent>
        <Typography align="center" color="textPrimary" variant="h5">
          {appointment.firstName + " " + appointment.lastName}
        </Typography>

        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
          gutterBottom
        >
          {moment(appointment.appointmentDate).format("MMM Do YYYY, h:mm:ss a")}
        </Typography>
        <Typography align="center" color="textPrimary" variant="body1">
          {appointment.phone}
        </Typography>
        <Typography align="center" color="textPrimary" variant="body2">
          {appointment.description}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 1 }}>
        <Grid container spacing={1} sx={{ justifyContent: "space-between" }}>
          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <IconButton
              style={{ marginRight: "5px" }}
              color="secondary"
              variant="contained"
              onClick={() => {
                EditAppointmentType(appointment._id, "C");
                addPatientAPI({
                  _id: appointment.patientId,
                  firstName: appointment.firstName,
                  lastName: appointment.lastName,
                  birthday: appointment.birthday,
                  phone: appointment.phone,
                  sexe: appointment.sexe,
                  address: "",
                  email: "",
                });
              }}
            >
              <CheckIcon />
            </IconButton>
          </Grid>

          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <ClockIcon color="action" />
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              {moment(appointment.createdAt).fromNow()}
            </Typography>
          </Grid>

          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <IconButton
              onClick={() => {
                deleteAppointment(appointment._id);
              }}
              color="error"
            >
              <DeleteIcon style={{ fontSize: "28px" }} />
            </IconButton>
          </Grid>

          {/* <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <PendingIcon color="action" />
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              Pending
            </Typography>
          </Grid> */}
        </Grid>
      </Box>
    </Card>
  );
};
AppointmentCardPending.propTypes = {
  appointment: PropTypes.object.isRequired,
};
