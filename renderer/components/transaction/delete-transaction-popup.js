import { Box, Button, Typography, Modal } from "@mui/material";
import { useContext } from "react";
import { TransactionsContext } from "../../pages/transactions";
import { DeleteTransactionsPopupContext } from "./transaction-list-toolbar";
import { style, backendURL } from "../../utils/constants";
import { getSelectedTransactionsIdsAmount } from "../../utils/functions";

export const DeleteTransactionPopup = () => {
  /* [ContextAPI]
   "selectedTransactionIds" send delete requests
   "transactionsList" to get mails 
    getter and setter for dependency value to refresh component after request sent
   */
  const {
    selectedTransactionIds,
    transactionsList,
    dependencyValue,
    setDependencyValue,
    enqueueSnackbar,
  } = useContext(TransactionsContext);

  /* [ContextAPI]
   getter and setter for "show" variable to handle closing and opening DeleteTransactionPopup from TransactionListToolbar
  */
  const { showDeleteTransactionsPopup, setShowDeleteTransactionsPopup } =
    useContext(DeleteTransactionsPopupContext);

  // Delete Request
  async function deleteSelectedTransactionsAPI() {
    try {
      const body = JSON.stringify({
        transactionIds: selectedTransactionIds,
      });
      const data = await fetch(`${backendURL}/transactions`, {
        method: "DELETE",
        headers: { "content-Type": "application/json" },
        body: body,
      });
      if (data.ok) {
        enqueueSnackbar(`Transactions Deleted Successfully`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        setDependencyValue(!dependencyValue);
      } else {
        throw new Error(`Failed to delete transaction: ${res.statusText}`);
      }

      console.log(data);
    } catch (err) {
      enqueueSnackbar(`ERROR Deleting Transactions`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.log(err);
    }
  }

  return (
    <Modal
      open={showDeleteTransactionsPopup}
      onClose={() => setShowDeleteTransactionsPopup(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Delete Transaction
        </Typography>
        <br></br>

        {
          // check transactions before delete
          selectedTransactionIds[0] == null ? (
            "\n No transactions selected \n\n "
          ) : (
            <div>
              {" "}
              Are you sure you want to delete those Transactions? <br></br>
              <br></br>
              {selectedTransactionIds &&
                transactionsList &&
                getSelectedTransactionsIdsAmount(
                  transactionsList,
                  selectedTransactionIds
                ).map((transaction, key) => (
                  <div key={key}>
                    {transaction}
                    <br></br>
                  </div>
                ))}
            </div>
          )
        }

        <Typography align="center">
          <br></br>
          {selectedTransactionIds[0] == null ? (
            <Button
              onClick={() => {
                setShowDeleteTransactionsPopup(false);
              }}
              variant="contained"
            >
              Ok
            </Button>
          ) : (
            <Button
              onClick={() => {
                deleteSelectedTransactionsAPI();
                setShowDeleteTransactionsPopup(false);
              }}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          )}
        </Typography>
      </Box>
    </Modal>
  );
};
