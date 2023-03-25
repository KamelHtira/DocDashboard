import { useState, useContext, createContext, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
//import { MedicalFilesContext } from "../../pages/medicalFiles.js";
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
  Button,
  CardHeader,
  Divider,
  Skeleton,
} from "@mui/material";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import { useRouter } from "next/router.js";
import moment from "moment";
import { EditMedicalFilePopup } from "./edit-medicalFile-popup";
import { backendURL } from "../../utils/constants";
// import { medicalFileNA } from "../../utils/constants.js";

export const EditMedicalFilesPopupContext = createContext(null);

export const MedicalFileListResults = ({ patientId }) => {
  // Dependency Value
  const [dependencyValue, setDependencyValue] = useState(false);

  // Medicalfiles
  const [medicalFilesList, setMedicalFilesList] = useState(null);
  // Set "show" variable for EditMedicalFilePopup
  const [showEditMedicalFilesPopup, setShowEditMedicalFilesPopup] = useState({
    show: false,
    id: null,
  });
  // Create varibale to handle selected MedicalFiles ids
  const [selectedMedicalFileIds, setSelectedMedicalFileIds] = useState([]);

  // const { medicalFilesList, selectedMedicalFileIds, setSelectedMedicalFileIds } =
  //   useContext(MedicalFilesContext);
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedMedicalFileIds;

    if (event.target.checked) {
      newSelectedMedicalFileIds = medicalFilesList.map(
        (medicalFile) => medicalFile._id
      );
    } else {
      newSelectedMedicalFileIds = [];
    }

    setSelectedMedicalFileIds(newSelectedMedicalFileIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedMedicalFileIds.indexOf(id);
    let newSelectedMedicalFileIds = [];

    if (selectedIndex === -1) {
      newSelectedMedicalFileIds = newSelectedMedicalFileIds.concat(
        selectedMedicalFileIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedMedicalFileIds = newSelectedMedicalFileIds.concat(
        selectedMedicalFileIds.slice(1)
      );
    } else if (selectedIndex === selectedMedicalFileIds.length - 1) {
      newSelectedMedicalFileIds = newSelectedMedicalFileIds.concat(
        selectedMedicalFileIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedMedicalFileIds = newSelectedMedicalFileIds.concat(
        selectedMedicalFileIds.slice(0, selectedIndex),
        selectedMedicalFileIds.slice(selectedIndex + 1)
      );
    }

    setSelectedMedicalFileIds(newSelectedMedicalFileIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${backendURL}/medicalFiles/patient/${patientId}`
        );
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setMedicalFilesList(data);
        } else {
          throw new Error("error getting customFields");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dependencyValue]);

  return (
    <Card style={{ margin: "20px 70px" }}>
      <CardHeader title={"Medical Files "} align="center" />
      <Divider />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          {medicalFilesList ? (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          selectedMedicalFileIds.length ===
                          medicalFilesList.length
                        }
                        color="primary"
                        indeterminate={
                          selectedMedicalFileIds.length > 0 &&
                          selectedMedicalFileIds.length <
                            medicalFilesList.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell> */}
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>From Now</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicalFilesList
                    .slice(0, limit)
                    .map((medicalFile, index) => (
                      <TableRow
                        hover
                        key={index}
                        selected={
                          selectedMedicalFileIds.indexOf(medicalFile._id) !== -1
                        }
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedMedicalFileIds.indexOf(
                                medicalFile._id
                              ) !== -1
                            }
                            onChange={(event) =>
                              handleSelectOne(event, medicalFile._id)
                            }
                            value="true"
                          />
                        </TableCell> */}
                        <TableCell
                          sx={{
                            width: "30%",
                          }}
                        >
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <Typography color="textPrimary" variant="body1">
                              {moment(medicalFile.createdAt).format(
                                "MMMM Do (dddd) YYYY"
                              )}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "15%",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {moment(medicalFile.createdAt).format("h:mm:ss a")}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "15%",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {moment(medicalFile.createdAt).fromNow()}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "30%",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {medicalFile.title}
                          </Typography>
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Button
                            onClick={() => {
                              setShowEditMedicalFilesPopup({
                                show: true,
                                id: medicalFile._id,
                              });
                            }}
                          >
                            <FolderSharedIcon></FolderSharedIcon>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={medicalFilesList.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[50, 100, 150]}
              />
            </>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell> */}
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>From Now</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  {/* <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell> */}
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Typography color="textPrimary" variant="body1">
                        <Skeleton height="35px" width="120px"></Skeleton>
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton height="35px" width="120px"></Skeleton>
                  </TableCell>
                  <TableCell>
                    <Skeleton height="35px" width="120px"></Skeleton>
                  </TableCell>
                  <TableCell>
                    <Skeleton height="35px" width="120px"></Skeleton>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Button>
                      <FolderSharedIcon></FolderSharedIcon>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </Box>
      </PerfectScrollbar>

      <EditMedicalFilesPopupContext.Provider
        value={{
          showEditMedicalFilesPopup,
          setShowEditMedicalFilesPopup,
          dependencyValue,
          setDependencyValue,
        }}
      >
        {showEditMedicalFilesPopup.show ? (
          <EditMedicalFilePopup medicalFilesList={medicalFilesList} />
        ) : (
          ""
        )}
      </EditMedicalFilesPopupContext.Provider>
    </Card>
  );
};
