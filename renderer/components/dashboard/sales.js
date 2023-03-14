import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Select, useTheme } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


function getMonthName(monthIndex) {
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ];
  return months[monthIndex - 1 ];
}

export const Sales = (props) => {
const [numberofMonths, setnumberofMonths] = useState(12);
const handleMonthChange = (event)=>{

  setnumberofMonths(event.target.value);

}

  const theme = useTheme();
  const [data, setData] = useState({
    datasets: [
      {
        backgroundColor: '#3F51B5',
        barPercentage: 0.5,
        barThickness: 250/numberofMonths,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [],
        label: 'Income',
        maxBarThickness: 150
      },
      {
        backgroundColor: '#EEEEEE',
        barPercentage: 0.5,
        barThickness: 250/numberofMonths,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [],
        label: 'Outcome',
        maxBarThickness: 150
      }
    ],
    labels: []
  });
  

  useEffect(() => {
  
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/barchart', {
          method: "POST",
          headers: { "content-Type": "application/json" },
          body: JSON.stringify({
            barMonths : numberofMonths,
          }),
        });
        const responseData = await response.json();
        const result = {};
        

for (const key in responseData) {
  const [year, month] = key.split('-');
  const formattedKey = `${getMonthName(parseInt(month))} - ${year.substring(2)}`;

  result[formattedKey] = responseData[key];

}
const labelData = Object.keys(result)
labelData[labelData.length - 1] += " (p)"
        const newData = {
          datasets: [
            {
              ...data.datasets[0],
              data: Object.values(result).map(item => item.income)
            },
            {
              ...data.datasets[1],
              data: Object.values(result).map(item => item.outcome)
            }
          ],
          labels: labelData
        };
        setData(newData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [numberofMonths]);
  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider
        }
      }
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Card {...props}>
      <CardHeader

        action={(
          <FormControl fullWidth >
           
            <InputLabel size="small" id="nbMonths" >Number of months</InputLabel>
          <Select  sx={{
            width: 200,
          }}
          size="small"
          fullWidth
          label="Number of months"
          name="Number of months"
          onChange={handleMonthChange}
          value={numberofMonths}
          variant="outlined"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
        >
          <MenuItem value={3} >3 Months</MenuItem>
          <MenuItem value={6} >6 Months</MenuItem>
          <MenuItem value={9}>9 Months</MenuItem>
          <MenuItem value={12}>12 Months</MenuItem>
          <MenuItem value={24}>24 Months</MenuItem>

        </Select>
        </FormControl>
        )}
        title="Latest Sales"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Bar
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
        >
          Overview
        </Button>
      </Box>
    </Card>
  );
};
