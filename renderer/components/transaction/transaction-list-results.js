import { useState, useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { TransactionsContext } from "../../pages/transactions.js";
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { generateTransactionsTypeStype } from "../../utils/functions.js";

export const TransactionListResults = ({ ...rest }) => {
  const {
    transactionsList,
    selectedTransactionIds,
    setSelectedTransactionIds,
  } = useContext(TransactionsContext);
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedTransactionIds;

    if (event.target.checked) {
      newSelectedTransactionIds = transactionsList.map(
        (transaction) => transaction._id
      );
    } else {
      newSelectedTransactionIds = [];
    }

    setSelectedTransactionIds(newSelectedTransactionIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedTransactionIds.indexOf(id);
    let newSelectedTransactionIds = [];

    if (selectedIndex === -1) {
      newSelectedTransactionIds = newSelectedTransactionIds.concat(
        selectedTransactionIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedTransactionIds = newSelectedTransactionIds.concat(
        selectedTransactionIds.slice(1)
      );
    } else if (selectedIndex === selectedTransactionIds.length - 1) {
      newSelectedTransactionIds = newSelectedTransactionIds.concat(
        selectedTransactionIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedTransactionIds = newSelectedTransactionIds.concat(
        selectedTransactionIds.slice(0, selectedIndex),
        selectedTransactionIds.slice(selectedIndex + 1)
      );
    }

    setSelectedTransactionIds(newSelectedTransactionIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selectedTransactionIds.length === transactionsList.length
                    }
                    color="primary"
                    indeterminate={
                      selectedTransactionIds.length > 0 &&
                      selectedTransactionIds.length < transactionsList.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionsList.slice(0, limit).map((transaction, index) => (
                <TableRow
                  hover
                  key={index}
                  selected={
                    selectedTransactionIds.indexOf(transaction._id) !== -1
                  }
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        selectedTransactionIds.indexOf(transaction._id) !== -1
                      }
                      onChange={(event) =>
                        handleSelectOne(event, transaction._id)
                      }
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Typography color="textPrimary" variant="body1">
                        {transaction.amount} dt
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      style={generateTransactionsTypeStype(transaction.type)}
                    >
                      {transaction.type}
                    </Typography>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={transactionsList.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[50, 100, 150]}
      />
    </Card>
  );
};
