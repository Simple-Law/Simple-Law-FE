const initialCountKeys = ["TOTAL", "REQUEST", "IN_PROGRESS", "RESPONSE", "DONE", "IMPORTANT"];

const initializeCounts = () => initialCountKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

const initialState = {
  mails: [],
  counts: initializeCounts(),
  trashMails: [], // 휴지통 목록
  trashCount: 0, // 휴지통 메일 갯수
};

const mailReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MAILS": {
      const mails = action.payload;

      const counts = mails.reduce((acc, mail) => {
        acc.TOTAL += 1;

        if (initialCountKeys.includes(mail.status)) {
          acc[mail.status] = (acc[mail.status] || 0) + 1;
        }

        if (mail.isImportant) {
          acc.IMPORTANT += 1;
        }

        return acc;
      }, initializeCounts());

      return { ...state, mails, counts };
    }

    case "ADD_REPLY":
      return {
        ...state,
        data: state.data.map(mail =>
          mail.id === action.payload.id ? { ...mail, replies: action.payload.reply } : mail,
        ),
      };

    case "TOGGLE_IMPORTANT":
      return {
        ...state,
        mails: state.mails.map(mail =>
          mail.caseKey === action.payload.caseKey ? { ...mail, isImportant: action.payload.isImportant } : mail,
        ),
      };

    case "SET_TRASH_MAILS": {
      const trashMails = action.payload;
      const trashCount = trashMails.length;
      return { ...state, trashMails, trashCount };
    }

    case "DELETE_TRASH_MAIL": {
      const updatedTrashMails = state.trashMails.filter(mail => mail.caseKey !== action.payload);
      return { ...state, trashMails: updatedTrashMails, trashCount: updatedTrashMails.length };
    }

    default:
      return state;
  }
};

export default mailReducer;
