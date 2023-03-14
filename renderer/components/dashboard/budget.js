import { useEffect, useState } from "react";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import MoneyIcon from "@mui/icons-material/Money";
import { backendURL } from "../../utils/constants";

export const Budget = (props) => {
  const [budgetData, setBudgetData] = useState(null);

  useEffect(() => {
    fetch(`${backendURL}/currentmonthlygain`)
      .then((response) => response.json())
      .then((data) => setBudgetData(data.gain))
      .catch((error) => console.log(error));
  }, []);

  return (
    <Card sx={{ height: "100%" }} {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
             CURRENT MONTH GAIN
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {budgetData != null ? `$${budgetData}` : "Loading..."}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "error.main",
                height: 56,
                width: 56,
              }}
            >
              <MoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
