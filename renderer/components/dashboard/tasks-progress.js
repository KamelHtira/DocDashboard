import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import InsertChartIcon from "@mui/icons-material/InsertChartOutlined";
import { backendURL } from "../../utils/constants";

export const TasksProgress = (props) => {
  const [percentage, setPercentage] = useState("loading..");

  useEffect(() => {
    const getPercentage = async () => {
      try {
        const data = await fetch(`${backendURL}/confirmedPerentage`);
        if (data.ok) {
          const dataJson = await data.json();
          setPercentage(dataJson.result);
        }
      } catch (error) {
        setPercentage("N/A");
        console.log(error);
      }
    };
    getPercentage();
  }, []);

  return (
    <Card sx={{ height: "100%" }} {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Pending to Queue
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {isNaN(percentage) ? percentage : `${percentage.toFixed(1)} %`}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "warning.main",
                height: 56,
                width: 56,
              }}
            >
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box sx={{ pt: 3 }}>
          <LinearProgress value={percentage} variant="determinate" />
        </Box>
      </CardContent>
    </Card>
  );
};
