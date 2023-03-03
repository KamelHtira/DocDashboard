import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

const userArray = localStorage.getItem("currentUser").split("-");
const user = {
  email: userArray[4],
  firstName: userArray[1],
  lastName: userArray[2],
  type: userArray[3],
  access: {
    dashboard: userArray[5] == "true",
    patient: userArray[6] == "true",
    transaction: userArray[7] == "true",
    setting: userArray[8] == "true",
    appointment: userArray[9] == "true",
  },
  state: userArray[10],
};

export const AccountProfile = (props) => {
  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{
              height: 64,
              mb: 2,
              width: 64,
            }}
          />
          <Typography color="textPrimary" gutterBottom variant="h5">
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography gutterBottom variant="h6" color="primary">
            {user.type}
          </Typography>
          <Box>
            <Typography gutterBottom color="textSecondary" variant="body2">
              {user.email}
            </Typography>

            <Typography gutterBottom color="text" variant="body1">
              Granted access:
            </Typography>
            <Typography
              noWrap={true}
              gutterBottom
              color="textSecondary"
              variant="body2"
            >
              Dashboard :&nbsp;&nbsp;
              {user.access.dashboard ? (
                <Typography component={"span"} color="success.main">
                  YES
                </Typography>
              ) : (
                <Typography component={"span"} color="error.main">
                  NO
                </Typography>
              )}
            </Typography>
            <Typography
              noWrap={true}
              gutterBottom
              color="textSecondary"
              variant="body2"
            >
              Patient :&nbsp;&nbsp;
              {user.access.patient ? (
                <Typography component={"span"} color="success.main">
                  YES
                </Typography>
              ) : (
                <Typography component={"span"} color="error.main">
                  NO
                </Typography>
              )}
            </Typography>

            <Typography
              noWrap={true}
              gutterBottom
              color="textSecondary"
              variant="body2"
            >
              Settings :&nbsp;&nbsp;
              {user.access.setting ? (
                <Typography component={"span"} color="success.main">
                  YES
                </Typography>
              ) : (
                <Typography component={"span"} color="error.main">
                  NO
                </Typography>
              )}
            </Typography>
            <Typography
              noWrap={true}
              gutterBottom
              color="textSecondary"
              variant="body2"
            >
              Transactions :&nbsp;&nbsp;
              {user.access.transaction ? (
                <Typography component={"span"} color="success.main">
                  YES
                </Typography>
              ) : (
                <Typography component={"span"} color="error.main">
                  NO
                </Typography>
              )}
            </Typography>
            <Typography
              noWrap={true}
              gutterBottom
              color="textSecondary"
              variant="body2"
            >
              Appointment :&nbsp;&nbsp;
              {user.access.appointment ? (
                <Typography component={"span"} color="success.main">
                  YES
                </Typography>
              ) : (
                <Typography component={"span"} color="error.main">
                  NO
                </Typography>
              )}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
