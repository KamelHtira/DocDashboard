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
import { useContext, useEffect, useState } from "react";
import { TransactionsContext } from "../../pages/transactions";
import { EditTransactionsPopupContext } from "./transaction-list-results";
import { backendURL, style } from "../../utils/constants";
import * as Yup from "yup";
import { parseDateString, getTransactionById } from "../../utils/functions";

export const EditTransactionPopup = () => {
  /* [ContextAPI]
    getter and setter for dependency value to refresh component after request sent
   */
  const { dependencyValue, setDependencyValue, transactionsList } =
    useContext(TransactionsContext);

  /* [ContextAPI]
   getter and setter for "show" variable and selected ID to handle closing and opening EditTransactionPopup from
   TransactionListToolbar
  */
  const { showEditTransactionsPopup, setShowEditTransactionsPopup } =
    useContext(EditTransactionsPopupContext);

  const [editTransactionResponseUI, setEditTransactionResponseUI] = useState({
    message: "",
    color: "",
    display: "none",
  });

  // Handle transaction response message
  function showEditTransactionResponseUI(message, amount, type) {
    if (message == "reset") {
      setEditTransactionResponseUI({
        display: "none",
        message: "",
        color: "",
      });
    } else if (message == "success") {
      setEditTransactionResponseUI({
        message: `Transaction ${amount} ${type} edited succefully`,
        color: "success.main",
        display: "block",
      });
    } else {
      setEditTransactionResponseUI({
        message: `${message}`,
        color: "error",
        display: "block",
      });
    }
  }

  // Edit Request
  async function editTransactionAPI(data) {
    try {
      const body = JSON.stringify(data);
      //`${backendURL}/transactions`
      const res = await fetch(backendURL+"/transactions/"+showEditTransactionsPopup.id, {
        method: "PATCH",
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
        showEditTransactionResponseUI("success", json.amount, json.type);
      } else {
        // show error message
        showEditTransactionResponseUI("Iternal Server error 501", null, null);
        throw new Error(`Failed to edit transaction: ${res.statusText}`);
      }
    } catch (err) {
      showEditTransactionResponseUI(
        "ERROR while editing transaction : Check internet connection",
        null,
        null
      );
      console.error(err);
    }
  }

  // [Formik] edit transaction
  const formik = useFormik({
    initialValues: getTransactionById(transactionsList, showEditTransactionsPopup.id),
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
      editTransactionAPI(body);
    },
  });

  return (
    <Modal
      open={showEditTransactionsPopup.show}
      onClose={() => {
        showEditTransactionResponseUI("reset", null, null);
        formik.resetForm();
        setShowEditTransactionsPopup({ show: false });
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Transaction
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
              Edit transaction
            </Button>

            {editTransactionResponseUI.display == "block" ? (
              <Typography
                color={editTransactionResponseUI.color}
                align="center"
              >
                <br></br>
                {editTransactionResponseUI.message}
              </Typography>
            ) : (
              ""
            )}
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
