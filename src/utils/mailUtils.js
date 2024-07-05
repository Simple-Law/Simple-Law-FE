export const filterMails = (data, statusKey) => {
  switch (statusKey) {
    case "important":
      return data.filter(mail => mail.isImportant);
    case "trash":
      return data.filter(mail => mail.status === "휴지통");
    case "All_request":
      return data;
    default:
      return data.filter(mail => mail.status === statusKey);
  }
};
