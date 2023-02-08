import { useState, useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { PatientsContext } from "../../pages/patients.js";
import { format } from "date-fns";
import {
  Avatar,
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

export const PatientListResults = ({ ...rest }) => {
  const { patientsList, selectedPatientIds, setSelectedPatientIds } =
    useContext(PatientsContext);
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedPatientIds;

    if (event.target.checked) {
      newSelectedPatientIds = patientsList.map((patient) => patient._id);
    } else {
      newSelectedPatientIds = [];
    }

    setSelectedPatientIds(newSelectedPatientIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedPatientIds.indexOf(id);
    let newSelectedPatientIds = [];

    if (selectedIndex === -1) {
      newSelectedPatientIds = newSelectedPatientIds.concat(
        selectedPatientIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedPatientIds = newSelectedPatientIds.concat(
        selectedPatientIds.slice(1)
      );
    } else if (selectedIndex === selectedPatientIds.length - 1) {
      newSelectedPatientIds = newSelectedPatientIds.concat(
        selectedPatientIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedPatientIds = newSelectedPatientIds.concat(
        selectedPatientIds.slice(0, selectedIndex),
        selectedPatientIds.slice(selectedIndex + 1)
      );
    }

    setSelectedPatientIds(newSelectedPatientIds);
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
                    checked={selectedPatientIds.length === patientsList.length}
                    color="primary"
                    indeterminate={
                      selectedPatientIds.length > 0 &&
                      selectedPatientIds.length < patientsList.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Age</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientsList.slice(0, limit).map((patient) => (
                <TableRow
                  hover
                  key={patient._id}
                  selected={selectedPatientIds.indexOf(patient._id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPatientIds.indexOf(patient._id) !== -1}
                      onChange={(event) => handleSelectOne(event, patient._id)}
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
                        {patient.firstName + " " + patient.lastName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={patientsList.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[50, 100, 150]}
      />
    </Card>
  );
};

PatientListResults.propTypes = {
  patients: PropTypes.array.isRequired,
};
