import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useSnackbar } from "notistack";
export const SettingsNotifications = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <form {...props}>
      <Card>
        <CardHeader
          subheader="Manage the application settings"
          title="General Settings"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={6} wrap="wrap">
            <Grid
              item
              md={5}
              sm={6}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              xs={12}
            >
              <FormControlLabel
                control={<Checkbox color="primary" defaultChecked />}
                label="Confirm before close"
              />
              <FormControlLabel
                control={<Checkbox color="primary" defaultChecked />}
                label="Automatic update"
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Show release note"
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Always show notifications"
              />
            </Grid>
            <Grid
              item
              md={4}
              sm={6}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              xs={12}
            >
              <FormControl fullWidth margin="normal">
                <InputLabel id="demo-simple-select-label">Langue</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Langue"
                  defaultValue={10}
                >
                  <MenuItem value={10}>Francais</MenuItem>
                  <MenuItem value={20}>English</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="demo-simple-select-label">Theme</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Langue"
                  defaultValue={10}
                >
                  <MenuItem value={10}>Light</MenuItem>
                  <MenuItem value={20}>Dark</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button
            onClick={() => {
              enqueueSnackbar("global snackbar", {
                variant: "success",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
              });
            }}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </Box>
      </Card>
    </form>
  );
};
