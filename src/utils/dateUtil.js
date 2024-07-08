import moment from "moment";

const formatDate = date => {
  return moment(date).format("YYYY-MM-DD");
};
const formatDotDate = date => {
  return moment(date).format("YYYY.MM.DD");
};

export { formatDate, formatDotDate };
