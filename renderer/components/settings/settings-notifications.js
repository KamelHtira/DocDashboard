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
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { addStringToArray, removeStringFromArray } from "../../utils/functions";
import { backendURL } from "../../utils/constants";

export const SettingsNotifications = (props) => {
  // set Disabled submit button
  const [submitButtonCustomFields, setSubmitButtonCustomFields] =
    useState(false);

  // The input of new field
  const [fieldInput, setfieldInput] = useState("");

  // Dependency value
  const [dependency, setDependency] = useState(false);

  // Get user customFields
  const [currentCustomFields, setCurrentCustomFields] = useState(null);

  function handleFieldInputChange(event) {
    setfieldInput(event.target.value);
  }

  function removeField(field) {
    const newFields = removeStringFromArray(currentCustomFields, field);
    setCurrentCustomFields(newFields);
    setDependency(!dependency);
    setfieldInput("");
  }

  function addField(field) {
    if (field) {
      setCurrentCustomFields(addStringToArray(currentCustomFields, field));
      setfieldInput("");
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSubmitButtonCustomFields(true);
        if (props.userId) {
          const res = await fetch(
            `${backendURL}/users/customFields/${props.userId}`
          );
          if (res.ok) {
            setSubmitButtonCustomFields(false);
            const data = await res.json();
            setCurrentCustomFields(data.customFields);
            console.log(data);
          } else {
            setSubmitButtonCustomFields(false);
            throw new Error("error getting customFields");
          }
        }
      } catch (error) {
        setSubmitButtonCustomFields(false);
        setCurrentCustomFields(["N/A"]);
      }
    };
    fetchData();
  }, [props.userId]);

  // Edit Request
  async function editCustomFieldsAPI() {
    try {
      setSubmitButtonCustomFields(true);
      const body = JSON.stringify({ customFields: currentCustomFields });
      const data = await fetch(`${backendURL}/users/${props.userId}`, {
        method: "PATCH",
        headers: { "content-Type": "application/json" },
        body: body,
      });
      if (data.ok) {
        setSubmitButtonCustomFields(false);
        // show success message
        enqueueSnackbar(`Custom Fields Edited Successfully`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        setSubmitButtonCustomFields(false);
        throw new Error(`Failed to add customFields`);
      }
    } catch (err) {
      setSubmitButtonCustomFields(false);
      enqueueSnackbar(`ERROR Editing CustomFields`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.error(err);
    }
  }

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
      <Card sx={{ marginTop: "30px", width: "60%" }}>
        <CardHeader
          subheader="Manage the medical file settings"
          title="Medical Files Settings"
        />
        <Divider />
        <CardContent>
          <Grid>
            <Table sx={{ backgroundColor: "#FBFBFB" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Fields</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {currentCustomFields &&
                  currentCustomFields.map((field, index) => (
                    <TableRow hover key={index}>
                      <TableCell>{field}</TableCell>

                      <TableCell padding="checkbox">
                        <Button
                          onClick={() => {
                            removeField(field);
                          }}
                        >
                          <DeleteIcon color="error"></DeleteIcon>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Grid>
        </CardContent>
        <Divider />

        <Grid container spacing={2} sx={{ p: "20px" }}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              size="small"
              label="Add New Field"
              name="firstName"
              onChange={handleFieldInputChange}
              value={fieldInput}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={2}>
            <Button
              fullWidth
              disabled={submitButtonCustomFields}
              onClick={() => {
                addField(fieldInput);
              }}
              color="primary"
              variant="contained"
            >
              Add
            </Button>
          </Grid>

          <Grid item xs={2}>
            <Button
              fullWidth
              disabled={submitButtonCustomFields}
              onClick={() => {
                editCustomFieldsAPI();
              }}
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Card>
    </form>
  );
};
