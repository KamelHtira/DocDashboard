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
  birthday: "loading..",
  email: "loading..",
  phone: "loading",
};

const patientNA = {
  firstName: "N/A",
  lastName: "",
  address: "N/A",
  birthday: "N/A",
  email: "N/A",
  phone: "N/A",
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
    birthday: "loading..",
    createdAt: "loading..",
    appointmentDate: "loading..",
    description: "loading..",
    //phone: "loading..",
    type: "P",
  },
  {
    id: "loading..",
    firstName: "loading..",
    lastName: "",
    birthday: "loading..",
    createdAt: "loading..",
    appointmentDate: "loading..",
    description: "loading..",
    //phone: "loading..",
    type: "C",
  },
  {
    id: "loading..",
    firstName: "loading..",
    lastName: "",
    birthday: "loading..",
    createdAt: "loading..",
    appointmentDate: "loading..",
    description: "loading..",
    //phone: "loading..",
    type: "Q",
  },
];

const accountIsLoading = {
  firstName: "Loading..",
  lastName: "Loading..",
  email: "Loading..",
  phone: "Loading..",
  state: "ariana",
  country: "Tunisia",
  access: {},
};

const accountNA = {
  firstName: "N/A",
  lastName: "N/A",
  email: "N/A",
  phone: "N/A",
  state: "ariana",
  country: "Tunisia",
};

const backendURL = "https://angry-gold-tam.cyclic.app";

export {
  style,
  backendURL,
  patientIsLoading,
  transactionIsLoading,
  appointmentIsLoading,
  patientNA,
  accountIsLoading,
  accountNA,
};
