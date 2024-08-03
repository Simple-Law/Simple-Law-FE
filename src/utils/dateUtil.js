import moment from "moment";

const dateFormat = "YYYY.MM.DD";

const formatDate = date => {
  return moment(date).format(dateFormat);
};

export { dateFormat, formatDate };
