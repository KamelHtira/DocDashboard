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
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../pages/account";
import { backendURL } from "../../utils/constants";

export const AccountProfile = (props) => {
  const { userId } = useContext(AccountContext);
  // Get current account data
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendURL}/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentAccount(data);
          console.log(data.access);
        } else {
          throw new Error("error getting account");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);
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
          {currentAccount?.access && (
            <>
              <Typography color="textPrimary" gutterBottom variant="h5">
                {`${currentAccount.firstName} ${currentAccount.lastName}`}
              </Typography>
              <Typography gutterBottom variant="h6" color="primary">
                {currentAccount.type}
              </Typography>
              <Box>
                <Typography gutterBottom color="textSecondary" variant="body2">
                  {currentAccount.email}
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
                  {currentAccount.access.dashboard ? (
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
                  {currentAccount.access.patient ? (
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
                  {currentAccount.access.setting ? (
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
                  {currentAccount.access.transaction ? (
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
                  {currentAccount.access.appointment ? (
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
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
