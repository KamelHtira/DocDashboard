import { useEffect, useState } from 'react';
import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
export const TotalPatients = (props) => {
  const [patientsData, setPatientsData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/currentmonthlypatients')
      .then((response) => response.json())
      .then((data) => setPatientsData(data.currentMonthPatients))
      .catch(error => console.log(error));
  }, []);
  

  return (
    <Card
      sx={{ height: '100%' }}
      {...props}
    >
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
            >
              TOTAL PATIENTS
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {patientsData ? `${patientsData}` : 'Loading...'}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'error.main',
                height: 56,
                width: 56
              }}
            >
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
