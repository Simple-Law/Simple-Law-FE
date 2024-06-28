import { createContext, useContext } from "react";
import propTypes from "prop-types";

const CommonContext = createContext();

export const useCommonContext = () => useContext(CommonContext);

const CommonProvider = ({ children }) => {
  const paginationConfig = {
    pageSize: 10,
    position: ["bottomCenter"],
  };

  return <CommonContext.Provider value={{ paginationConfig }}>{children}</CommonContext.Provider>;
};

CommonProvider.propTypes = {
  children: propTypes.node.isRequired,
};

export default CommonProvider;
