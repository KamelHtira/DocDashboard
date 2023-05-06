import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  FormControl,
  Select,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { TransactionsContext } from "../../pages/transactions";
import { AddTransactionsPopupContext } from "./transaction-list-toolbar";
import { backendURL, style } from "../../utils/constants";
import * as Yup from "yup";
import { parseDateString } from "../../utils/functions";

export const AddTransactionPopup = () => {
  /* [ContextAPI]
    getter and setter for dependency value to refresh component after request sent
   */
  const { dependencyValue, setDependencyValue, enqueueSnackbar } =
    useContext(TransactionsContext);

  /* [ContextAPI]
   getter and setter for "show" variable to handle closing and opening AddTransactionPopup from TransactionListToolbar
  */
  const { showAddTransactionsPopup, setShowAddTransactionsPopup } = useContext(
    AddTransactionsPopupContext
  );

  // Add Request
  async function addTransactionAPI(data) {
    try {
      const body = JSON.stringify(data);
      const res = await fetch(`${backendURL}/transactions`, {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: body,
      });
      if (res.ok) {
        const json = await res.json();
        // Refresh list
        setDependencyValue(!dependencyValue);

        // Reset form
        formik.resetForm();

        // show success message
        enqueueSnackbar(`Transaction Added Successfully`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        throw new Error(`Failed to add transaction: ${res.statusText}`);
      }
    } catch (err) {
      enqueueSnackbar(`ERROR Adding Transaction`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.error(err);
    }
  }

  // [Formik] add transaction
  const formik = useFormik({
    initialValues: {
      amount: "",
      type: "",
      date: new Date().toLocaleDateString(),
      description: "",
    },
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
      addTransactionAPI(body);
    },
  });

  return (
    <Modal
      open={showAddTransactionsPopup}
      onClose={() => {
        formik.resetForm();
        setShowAddTransactionsPopup(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Transaction
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            size="small"
            error={Boolean(formik.touched.amount && formik.errors.amount)}
            fullWidth
            helperText={formik.touched.amount && formik.errors.amount}
            label="Amount"
            margin="normal"
            name="amount"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.amount}
            variant="outlined"
            type="number"
          />
          <FormControl margin="normal" fullWidth>
            <InputLabel size="small" id="demo-simple-select-label">
              Type
            </InputLabel>
            <Select
              size="small"
              error={Boolean(formik.touched.type && formik.errors.type)}
              fullWidth
              label="Type"
              name="type"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.type}
              variant="outlined"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
            >
              <MenuItem value={"Income"}>Income</MenuItem>
              <MenuItem value={"Outcome"}>Outcome</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            error={Boolean(formik.touched.date && formik.errors.date)}
            fullWidth
            helperText={formik.touched.date && formik.errors.date}
            label="Date MM/DD/YYYY"
            margin="normal"
            name="date"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.date}
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

          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Add transaction
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
