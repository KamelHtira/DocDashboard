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
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
export const AppointmentCardConfirmed = ({ appointment, ...rest }) => {
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
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {appointment.firstName + " " + appointment.lastName}
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
      <Box sx={{ p: 2 }}>
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
              2hr ago
            </Typography>
          </Grid>

          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <IconButton color="error">
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
