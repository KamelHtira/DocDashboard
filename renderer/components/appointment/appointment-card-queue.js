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
import PaidIcon from "@mui/icons-material/Paid";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import moment from "moment";
import { AppointmentsContext } from "../../pages/appointments";
import { useContext } from "react";
import { PaidAppointmentsPopupContext } from "./appointment-list-results";
import { PaidAppointmentPopup } from "./set-paid-popup";

export const AppointmentCardQueue = ({ appointment, ...rest }) => {
  const { deleteAppointment } = useContext(AppointmentsContext);

  const { showPaidAppointmentsPopup, setShowPaidAppointmentsPopup } =
    useContext(PaidAppointmentsPopupContext);
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
                setShowPaidAppointmentsPopup(true);
              }}
            >
              <PaidIcon />
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
        </Grid>
      </Box>
      {showPaidAppointmentsPopup && (
        <PaidAppointmentPopup appointment={appointment} />
      )}
    </Card>
  );
};
AppointmentCardQueue.propTypes = {
  appointment: PropTypes.object.isRequired,
};
