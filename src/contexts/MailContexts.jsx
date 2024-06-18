import React, { createContext, useContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchMails } from "apis/mailsApi";

const MailContext = createContext();

export const useMailContext = () => useContext(MailContext);

const initialState = {
  mails: [],
  data: [],
  counts: {
    total: 0,
    preparing: 0,
    pending: 0,
    completed: 0,
    refuse: 0,
    important: 0,
    trash: 0,
  },
  tableData: [], // 추가: tableData 초기 상태
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_MAILS":
      return { ...state, mails: action.payload };
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "UPDATE_COUNTS": {
      const mails = action.payload;
      const nonTrashData = mails.filter(mail => mail.status !== "휴지통");
      const counts = {
        total: nonTrashData.length,
        preparing: nonTrashData.filter(mail => mail.status === "preparing").length,
        pending: nonTrashData.filter(mail => mail.status === "pending").length,
        completed: nonTrashData.filter(mail => mail.status === "completed").length,
        refuse: nonTrashData.filter(mail => mail.status === "refuse").length,
        important: nonTrashData.filter(mail => mail.isImportant).length,
        trash: mails.filter(mail => mail.status === "휴지통").length,
      };
      return { ...state, counts };
    }
    case "SET_TABLE_DATA": // 추가: tableData 액션 처리
      return { ...state, tableData: action.payload };
    default:
      return state;
  }
};

export const MailProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await fetchMails();
      if (error) return;

      dispatch({ type: "SET_DATA", payload: data });
      dispatch({ type: "SET_MAILS", payload: data.filter(mail => mail.status !== "휴지통") });
      dispatch({ type: "UPDATE_COUNTS", payload: data });
      dispatch({ type: "SET_TABLE_DATA", payload: data }); // 추가: 초기 테이블 데이터 설정
    };

    fetchData();
  }, []);

  return <MailContext.Provider value={{ state, dispatch }}>{children}</MailContext.Provider>;
};
MailProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
