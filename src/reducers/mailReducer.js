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
  tableData: [],
};

const mailReducer = (state = initialState, action) => {
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
    case "SET_TABLE_DATA":
      return { ...state, tableData: action.payload };
    default:
      return state;
  }
};

export default mailReducer;
