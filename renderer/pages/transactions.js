import Head from "next/head";
import { Box, Container } from "@mui/material";
import { TransactionListResults } from "../components/transaction/transaction-list-results";
import { TransactionListToolbar } from "../components/transaction/transaction-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { createContext, useState, useEffect } from "react";
import { transactionIsLoading,backendURL } from "../utils/constants";
import { useSnackbar } from "notistack";
export const TransactionsContext = createContext(null);

const Transactions = () => {
  // Provide SnackBar function
  const { enqueueSnackbar } = useSnackbar();

  // Create Dependency value to refresh list
  const [dependencyValue, setDependencyValue] = useState(1);

  // Create varibale to handle selected transactions ids
  const [selectedTransactionIds, setSelectedTransactionIds] = useState([]);

  // Fetch transactions data
  const [transactionsList, setTransactionsList] = useState([transactionIsLoading]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setTransactionsList([transactionIsLoading]);
        const res = await fetch(
          `${backendURL}/transactions`
        );
        const data = await res.json();
        setTransactionsList(data);
      } catch (error) {
        setTransactionsList([
          {
            amount: "N/A",
            type: "N/A",
            date: "N/A",
            description: "N/A",
          },
        ]);
      }
    };
    fetchData();
  }, [dependencyValue]);

  return (
    <>
      <Head>
        <title>Transactions</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <TransactionsContext.Provider
            value={{
              transactionsList,
              selectedTransactionIds,
              setSelectedTransactionIds,
              dependencyValue,
              setDependencyValue,
              enqueueSnackbar
            }}
          >
            <TransactionListToolbar />
            <Box sx={{ mt: 3 }}>
              <TransactionListResults />
            </Box>
          </TransactionsContext.Provider>
        </Container>
      </Box>
    </>
  );
};
Transactions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Transactions;
