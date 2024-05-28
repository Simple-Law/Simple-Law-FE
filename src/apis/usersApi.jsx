import axios from "axios";
import moment from "moment";

const baseURL = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

// Other API functions...

export const registerUser = async userData => {
  try {
    const registrationDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const response = await baseURL.post("/users", { ...userData, registrationDate });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
