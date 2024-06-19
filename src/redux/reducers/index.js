import authReducer from "./authReducer";
import mailReducer from "./mailReducer";

const rootReducer = {
  auth: authReducer,
  mail: mailReducer,
};

export default rootReducer;
