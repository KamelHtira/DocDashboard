import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import ElderlyIcon from "@mui/icons-material/Elderly";
import ManIcon from "@mui/icons-material/Man";
import { backendURL } from "../../utils/constants";
export const Demographics = (props) => {
  const theme = useTheme();
  const [data, setData] = useState({
    datasets: [
      {
        data: [],
        backgroundColor: ["#3F51B5", "#e53935", "#FB8C00"],
        borderWidth: 8,
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF",
      },
    ],
    labels: [],
  });

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };
  const [percentage, setPercentage] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendURL}/patientsAge`);
        const result = await response.json();
        const values = Object.values(result);
        const labels = Object.keys(result);
        const newData = {
          datasets: [
            {
              ...data.datasets[0],
              data: [values[0][0], values[1][0], values[2][0]],
            },
          ],
          labels,
        };
        setData(newData);

        // Only map percentages for available age groups
        const newPercentage = [
          {
            title: labels[0],
            value: values[0][1],
            icon: EscalatorWarningIcon,
            color: "#3F51B5",
          },
          {
            title: labels[1],
            value: values[1][1],
            icon: ManIcon,
            color: "#E53935",
          },
          {
            title: labels[2],
            value: values[2][1],
            icon: ElderlyIcon,
            color: "#FB8C00",
          },
        ];
        setPercentage(newPercentage);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card {...props}>
      <CardHeader title="Demographics" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: "relative",
          }}
        >
          <Doughnut data={data} options={options} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
          }}
        >
          {percentage.map(({ color, icon: Icon, title, value }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: "center",
              }}
            >
              <Icon color="action" />
              <Typography color="textPrimary" variant="body1">
                {title}
              </Typography>
              <Typography style={{ color }} variant="h4">
                {value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
