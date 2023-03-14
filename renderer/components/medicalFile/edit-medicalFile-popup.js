import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  FormControl,
  Select,
  Divider,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
//import { MedicalFilesContext } from "../../pages/medicalFiles";
import { EditMedicalFilesPopupContext } from "./medicalFile-list-results";
import { backendURL, style } from "../../utils/constants";
import * as Yup from "yup";
import { parseDateString, getMedicalFileById } from "../../utils/functions";
import { Grid } from "@material-ui/core";

export const EditMedicalFilePopup = ({ medicalFilesList }) => {
  /* [ContextAPI]
    getter and setter for dependency value to refresh component after request sent
   */
  // const {
  //   dependencyValue,
  //   setDependencyValue,
  //   medicalFilesList,
  //   enqueueSnackbar,
  // } = useContext(MedicalFilesContext);

  /* [ContextAPI]
   getter and setter for "show" variable and selected ID to handle closing and opening EditMedicalFilePopup from
   MedicalFileListToolbar
  */
  const { showEditMedicalFilesPopup, setShowEditMedicalFilesPopup } =
    useContext(EditMedicalFilesPopupContext);

  // Edit Request
  async function editMedicalFileAPI(data) {
    try {
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
        const json = await res.json();

        // Refresh list
        setDependencyValue(!dependencyValue);

        // Reset form
        formik.resetForm();

        // show success message
        enqueueSnackbar(`MedicalFile Edited Successfully`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        throw new Error(`Failed to edit medicalFile: ${res.statusText}`);
      }
    } catch (err) {
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
    initialValues: getMedicalFileById(
      medicalFilesList,
      showEditMedicalFilesPopup.id
    ),
    validationSchema: Yup.object({
      amount: Yup.number().required("Amount is required"),
      description: Yup.string(),
      date: Yup.date().transform(parseDateString),
      type: Yup.string().required("type is required"),
    }),
    onSubmit: () => {
      const body = {
        amount: formik.values.amount,
        description: formik.values.description,
        date: formik.values.date,
        type: formik.values.type,
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
      <Box sx={{ ...style, width: "900px", height: "650px" }}>
        <Typography margin id="modal-modal-title" variant="h4" component="h2">
          Medical File
        </Typography>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <Typography margin id="modal-modal-title" variant="h5" component="h2">
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
            helperText={formik.touched.description && formik.errors.description}
            label="Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            variant="outlined"
            multiline
            rows={3}
          />
          <Grid container>
            <Grid item xs={6}>
              <Typography
                margin
                id="modal-modal-title"
                variant="h5"
                component="h2"
              >
                Patient informations
              </Typography>
              <Typography margin="20px" variant="">
                - Kamel Htira
              </Typography>
              <Typography margin="20px">- (+216) 50 923 251</Typography>
              <Typography margin="20px">- Mnihla Oliya, Ariana</Typography>
              <Typography margin="20px" variant="body1">
                - Birth Date : 2/9/2023
              </Typography>
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

              <Typography margin="20px" variant="body1">
                - Weight : 55kg
              </Typography>
              <Typography margin="20px" variant="body1">
                - Height : 1.81 m
              </Typography>
              <Typography margin="20px" variant="body1">
                - Weight : 55kg
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
