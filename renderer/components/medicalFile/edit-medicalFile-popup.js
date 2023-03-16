import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { EditMedicalFilesPopupContext } from "./medicalFile-list-results";
import { backendURL, style } from "../../utils/constants";
import * as Yup from "yup";
import { Grid } from "@material-ui/core";
import { useSnackbar } from "notistack";

export const EditMedicalFilePopup = ({ medicalFilesList }) => {
  /* [ContextAPI]
    getter and setter for dependency value to refresh component after request sent
   */
  // const {
  //   dependencyValue,
  //   setDependencyValue,
  // } = useContext(MedicalFilesContext);

  /* [ContextAPI]
   getter and setter for "show" variable and selected ID to handle closing and opening EditMedicalFilePopup from
   MedicalFileListToolbar
  */
  const { enqueueSnackbar } = useSnackbar();

  const {
    showEditMedicalFilesPopup,
    setShowEditMedicalFilesPopup,
    setDependencyValue,
    dependencyValue,
  } = useContext(EditMedicalFilesPopupContext);

  const [disabled, setDisabled] = useState(false);

  // medical File values
  const [currentMedicalFile, setCurrentMedicalFile] = useState({
    title: "",
    description: "",
  });
  // Get current medical file data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${backendURL}/medicalFiles/${showEditMedicalFilesPopup.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setCurrentMedicalFile(data);
        } else {
          throw new Error("error getting account");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Edit Request
  async function editMedicalFileAPI(data) {
    try {
      setDisabled(true);
      const body = JSON.stringify(data);
      //`${backendURL}/medicalFiles`
      const res = await fetch(
        backendURL + "/medicalFiles/" + showEditMedicalFilesPopup.id,
        {
          method: "PATCH",
          headers: { "content-Type": "application/json" },
          body: body,
        }
      );
      if (res.ok) {
        setDisabled(false);
        // show success message
        enqueueSnackbar(`MedicalFile Edited Successfully`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        setDependencyValue(!dependencyValue);
      } else {
        throw new Error(`Failed to edit medicalFile: ${res.statusText}`);
      }
    } catch (err) {
      setDisabled(false);
      enqueueSnackbar(`ERROR Editing MedicalFile`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.error(err);
    }
  }

  // [Formik] edit medicalFile
  const formik = useFormik({
    initialValues: currentMedicalFile,
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string(),
    }),
    onSubmit: () => {
      const body = {
        title: formik.values.title,
        description: formik.values.description,
      };
      editMedicalFileAPI(body);
    },
  });

  return (
    <Modal
      open={showEditMedicalFilesPopup.show}
      onClose={() => {
        formik.resetForm();
        setShowEditMedicalFilesPopup({ show: false });
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, width: "900px", height: "480px" }}>
        <Typography margin id="modal-modal-title" variant="h4" component="h2">
          Medical File
        </Typography>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <Grid container>
            <Grid item xs={6}>
              <Typography
                margin
                id="modal-modal-title"
                variant="h5"
                component="h2"
              >
                Medical File informations
              </Typography>
              <TextField
                size="small"
                error={Boolean(formik.touched.title && formik.errors.title)}
                fullWidth
                helperText={formik.touched.title && formik.errors.title}
                label="Title"
                margin="normal"
                name="title"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.title}
                variant="outlined"
              ></TextField>
              <TextField
                size="small"
                error={Boolean(
                  formik.touched.description && formik.errors.description
                )}
                fullWidth
                helperText={
                  formik.touched.description && formik.errors.description
                }
                label="Description"
                margin="normal"
                name="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description}
                variant="outlined"
                multiline
                rows={7}
              />
            </Grid>

            <Grid item xs={1}></Grid>
            <Grid item xs={5}>
              <Typography
                margin
                id="modal-modal-title"
                variant="h5"
                component="h2"
              >
                Specific informations
              </Typography>

              {currentMedicalFile.customFields &&
                Object.keys(currentMedicalFile.customFields).map(
                  (field, index) => (
                    <Typography key={index} margin="20px" variant="body1">
                      {`- ${field} : ${currentMedicalFile.customFields[field]}`}
                    </Typography>
                  )
                )}
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              py: 2,
            }}
          >
            <Button
              disabled={disabled}
              sx={{
                background: "#9CA3AF",
                "&:hover": {
                  background: "#6B7280",
                },
              }}
              type="submit"
              style={{ width: "15%", marginRight: "10px" }}
              variant="contained"
              onClick={() => {
                setShowEditMedicalFilesPopup({ show: false });
              }}
            >
              Close
            </Button>
            <Button
              disabled={disabled}
              color="primary"
              type="submit"
              style={{ width: "15%" }}
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
