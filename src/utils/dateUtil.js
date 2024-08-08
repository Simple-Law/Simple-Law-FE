import dayjs from "dayjs";

const dateFormat = "YYYY.MM.DD";

const formatDate = date => {
  return dayjs(date).format(dateFormat);
};

export { dateFormat, formatDate };
