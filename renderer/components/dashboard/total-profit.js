import { useState, useEffect } from "react";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { backendURL } from "../../utils/constants";

export const TotalProfit = (props) => {
  const [totalProfit, setTotalProfit] = useState(null);

  useEffect(() => {
    fetch(`${backendURL}/totalprofit`)
      .then((response) => response.json())
      .then((data) => setTotalProfit(data.gain))
      .catch((error) => console.log(error));
  }, []);

  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item xs={9}>
            <Typography color="textSecondary" gutterBottom variant="overline">
              CURRENT MONTH INCOme
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {totalProfit ? `$${totalProfit}` : "Loading..."}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Avatar
              sx={{
                backgroundColor: "primary.main",
                height: 56,
                width: 56,
              }}
            >
              <AttachMoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
