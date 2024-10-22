import dayjs from "dayjs";

const dateFormat = "YYYY.MM.DD";

const formatDate = date => {
  return dayjs(date).format(dateFormat);
};

const formatTime = date => {
  return dayjs(date).format("HH:mm:ss");
};

export { dateFormat, formatDate, formatTime };
