import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { Clock as ClockIcon } from "../../icons/clock";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

export const AppointmentCardSkeleton = ({ rest }) => {
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
          <Skeleton height="50px"></Skeleton>
        </Typography>

        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
          gutterBottom
        >
          <Skeleton></Skeleton>
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
            >
              <Skeleton variant="circular" width={"30px"}></Skeleton>
            </IconButton>
          </Grid>

          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              <Skeleton width={"130px"}></Skeleton>
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
              <Skeleton variant="circular" width={"30px"}></Skeleton>
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};
