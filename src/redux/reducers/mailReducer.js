import { commonStatusLabels } from "utils/statusLabels";

const initialCountKeys = [
  "total",
  "contactRequest",
  "approvalPending",
  "resolving",
  "resolved",
  "requestInProgress",
  "preparing",
  "pending",
  "completed",
  "refuse",
  "important",
  "trash",
];

const initializeCounts = () => initialCountKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

const initialState = {
  mails: [],
  data: [],
  counts: initializeCounts(),
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
      const counts = mails.reduce((acc, mail) => {
        if (mail.status !== commonStatusLabels.trash) {
          acc.total += 1;
          acc[mail.status] = (acc[mail.status] || 0) + 1;
          if (mail.isImportant) acc.important += 1;
        } else {
          acc.trash += 1;
        }
        return acc;
      }, initializeCounts());

      return { ...state, counts };
    }
    case "SET_TABLE_DATA":
      return { ...state, tableData: action.payload };
    default:
      return state;
  }
};

export default mailReducer;
