

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
  amount: "loading..",
  type: "loading..",
  date: "loading..",
  description: "loading..",
};

const appointmentIsLoading = [
  {
    id: "loading..",
    firstName: "loading..",
    lastName: "",
    age: "loading..",
    createdAt: "loading..",
    appointmentDate: "loading..",
    description: "loading..",
    phone: "loading..",
    type: "P",
  },
  {
    id: "loading..",
    firstName: "loading..",
    lastName: "",
    age: "loading..",
    createdAt: "loading..",
    appointmentDate: "loading..",
    description: "loading..",
    phone: "loading..",
    type: "C",
  },
  {
    id: "loading..",
    firstName: "loading..",
    lastName: "",
    age: "loading..",
    createdAt: "loading..",
    appointmentDate: "loading..",
    description: "loading..",
    phone: "loading..",
    type: "Q",
  },
];

const backendURL = "https://angry-gold-tam.cyclic.app";

export {
  style,
  backendURL,
  patientIsLoading,
  transactionIsLoading,
  appointmentIsLoading,
};
