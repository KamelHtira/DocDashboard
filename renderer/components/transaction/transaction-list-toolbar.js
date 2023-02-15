import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "../../icons/search";
import { Download as DownloadIcon } from "../../icons/download";
import { DeleteTransactionPopup } from "./delete-transaction-popup";
import { useState, createContext, useContext } from "react";
import { AddTransactionPopup } from "./add-transaction-popup";
import { downloadCSV } from "../../utils/functions";
import { TransactionsContext } from "../../pages/transactions";


export const DeleteTransactionsPopupContext = createContext(null);
export const AddTransactionsPopupContext = createContext(null);

export const TransactionListToolbar = (props) => {

  /* [ContextAPI]
   Get "selectedTransactionIds" to export data
   */
  const { selectedTransactionIds } = useContext(TransactionsContext);

  // Set "show" variable for DeleteTransactionPopup
  const [showDeleteTransactionsPopup, setShowDeleteTransactionsPopup] =
    useState(false);

  // Set "show" variable for DeleteTransactionPopup
  const [showAddTransactionsPopup, setShowAddTransactionsPopup] =
    useState(false);

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Transactions
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button
            onClick={() => {
              downloadCSV(selectedTransactionIds);
            }}
            startIcon={<DownloadIcon fontSize="small" />}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setShowAddTransactionsPopup(true);
            }}
          >
            Add Transactions
          </Button>
          <AddTransactionsPopupContext.Provider
            value={{
              showAddTransactionsPopup,
              setShowAddTransactionsPopup,
            }}
          >
            <AddTransactionPopup />
          </AddTransactionsPopupContext.Provider>

          <Button
            sx={{ marginLeft: "10px" }}
            color="error"
            variant="contained"
            onClick={() => {
              setShowDeleteTransactionsPopup(true);
            }}
          >
            Delete Transactions
          </Button>
          <DeleteTransactionsPopupContext.Provider
            value={{
              showDeleteTransactionsPopup,
              setShowDeleteTransactionsPopup,
            }}
          >
            <DeleteTransactionPopup />
          </DeleteTransactionsPopupContext.Provider>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon color="action" fontSize="small">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search transaction"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
