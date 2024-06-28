import { createContext, useContext } from "react";

const CommonContext = createContext();

export const useCommonContext = () => useContext(CommonContext);

const CommonProvider = ({ children }) => {
  const paginationConfig = {
    pageSize: 10,
    position: ["bottomCenter"],
  };

  return <CommonContext.Provider value={{ paginationConfig }}>{children}</CommonContext.Provider>;
};

export default CommonProvider;
