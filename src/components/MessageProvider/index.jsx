import React, { createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { message } from "antd";

const MessageApiContext = createContext(null);

export const useMessageApi = () => useContext(MessageApiContext);

const MessageProvider = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageApiContext.Provider value={messageApi}>
      {contextHolder}
      <Outlet />
    </MessageApiContext.Provider>
  );
};

export default MessageProvider; // MessageProvider를 default로 내보냄
