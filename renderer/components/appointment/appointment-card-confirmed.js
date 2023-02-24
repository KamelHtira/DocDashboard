import DeleteIcon from "@mui/icons-material/Delete";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid, IconButton, Typography
} from "@mui/material";
// import Box from "@mui/material/Box"
import moment from "moment";
import PropTypes from "prop-types";
import { useContext } from "react";
import { Clock as ClockIcon } from "../../icons/clock";
import { AppointmentsContext } from "../../pages/appointments";

export const AppointmentCardConfirmed = ({ appointment, ...rest }) => {
  const { deleteAppointment,EditAppointmentType } = useContext(AppointmentsContext);
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
              onClick={()=>{EditAppointmentType(appointment._id,"Q")}}
            >
              <HowToRegIcon />
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
            <IconButton onClick={()=>{deleteAppointment(appointment._id)}} color="error">
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
            <ConfirmedIcon color="action" />
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              Confirmed
            </Typography>
          </Grid> */}
        </Grid>
      </Box>
    </Card>
  );
};
AppointmentCardConfirmed.propTypes = {
  appointment: PropTypes.object.isRequired,
};
