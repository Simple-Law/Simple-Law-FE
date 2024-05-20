// contexts/MailContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
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
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_MAILS":
      return { ...state, mails: action.payload };
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "UPDATE_COUNTS":
      const mails = action.payload;
      const nonTrashData = mails.filter(mail => mail.statue !== "휴지통");
      const counts = {
        total: nonTrashData.length,
        preparing: nonTrashData.filter(mail => mail.statue === "preparing").length,
        pending: nonTrashData.filter(mail => mail.statue === "pending").length,
        completed: nonTrashData.filter(mail => mail.statue === "completed").length,
        refuse: nonTrashData.filter(mail => mail.statue === "refuse").length,
        important: nonTrashData.filter(mail => mail.isImportant).length,
        trash: mails.filter(mail => mail.statue === "휴지통").length,
      };
      return { ...state, counts };
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
      dispatch({ type: "SET_MAILS", payload: data.filter(mail => mail.statue !== "휴지통") });
      dispatch({ type: "UPDATE_COUNTS", payload: data });
    };

    fetchData();
  }, []);

  return <MailContext.Provider value={{ state, dispatch }}>{children}</MailContext.Provider>;
};
