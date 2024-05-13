import React, { createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { message } from "antd";

const MessageApiContext = createContext(null);

export const useMessageApi = () => useContext(MessageApiContext);

const AppLayout = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageApiContext.Provider value={messageApi}>
      {contextHolder}
      <Outlet />
    </MessageApiContext.Provider>
  );
};

export default AppLayout; // AppLayout을 default로 내보냄
