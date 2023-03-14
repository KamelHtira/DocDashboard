import { useEffect, useState } from 'react';
import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoneyIcon from '@mui/icons-material/Money';

export const Budget = (props) => {
  const [budgetData, setBudgetData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/currentmonthlygain')
      .then((response) => response.json())
      .then((data) => setBudgetData(data.gain))
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
              BUDGET
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {budgetData != null ? `$${budgetData}` : 'Loading...'}
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
              <MoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
