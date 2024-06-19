import React, { createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { message } from "antd";

const MessageApiContext = createContext(null);

export const useMessageApi = () => useContext(MessageApiContext);

/**
 * MessageProvider 컴포넌트
 * 하위 컴포넌트들에게 메시지 API를 제공
 * Ant Design의 message 컴포넌트를 사용하여 메시지 전역 관리.
 */
const MessageProvider = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageApiContext.Provider value={messageApi}>
      {contextHolder}
      <Outlet />
    </MessageApiContext.Provider>
  );
};

export default MessageProvider;
