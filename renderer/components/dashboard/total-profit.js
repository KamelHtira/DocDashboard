import { useState, useEffect } from 'react';
import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const TotalProfit = (props) => {
  const [totalProfit, setTotalProfit] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/totalprofit')
      .then(response => response.json())
      .then(data => setTotalProfit(data.gain))
      .catch(error => console.log(error));
  }, []);

  return (
    <Card {...props}>
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
              TOTAL PROFIT
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {totalProfit ? `$${totalProfit}` : 'Loading...'}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'primary.main',
                height: 56,
                width: 56
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



