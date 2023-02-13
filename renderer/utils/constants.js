const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};
const patientIsLoading = {
  firstName: "loading..",
  lastName: "",
  address: "loading..",
  age: "loading..",
  email: "loading..",
  phone: "loading",
};

const transactionIsLoading = {
  firstName: "loading..",
  lastName: "",
  address: "loading..",
  age: "loading..",
  email: "loading..",
  phone: "loading",
};

const backendURL = "https://shy-pear-catfish-cap.cyclic.app";
export { style, backendURL, patientIsLoading, transactionIsLoading };
