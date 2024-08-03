import { useEffect } from "react";
import { DatePicker, Tag } from "antd";
import PropTypes from "prop-types";
import { dateFormat } from "utils/dateUtil";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
dayjs.extend(weekday);
dayjs.extend(localeData);

/**
 * 목록 검색용 기간 선택 컴포넌트
 */
const SearchDatePicker = ({ paramDate, setParamDate }) => {
  const { RangePicker } = DatePicker;
  const today = dayjs();

  const dateTagList = [
    { label: "오늘", value: today },
    { label: "1주", value: today.subtract(1, "week") },
    { label: "15일", value: today.subtract(15, "day") },
    { label: "1개월", value: today.subtract(1, "month") },
    { label: "3개월", value: today.subtract(3, "month") },
    { label: "6개월", value: today.subtract(6, "month") },
  ];

  /**
   * 날짜 태그 클릭 이벤트
   * @param {dayjs} tagDate
   */
  const clickDateTag = tagDate => {
    setParamDate({
      ...paramDate,
      startDate: tagDate,
    });
  };

  return (
    <div className='flex'>
      <RangePicker
        format={dateFormat}
        defaultValue={[paramDate.startDate, paramDate.endDate]}
        value={[paramDate.startDate, paramDate.endDate]}
        maxDate={today}
      />
      <div>
        {dateTagList.map((date, idx) => (
          <Tag
            className='ml-[3px] cursor-pointer'
            key={idx}
            onClick={() => {
              clickDateTag(date.value);
            }}
          >
            {date.label}
          </Tag>
        ))}
      </div>
    </div>
  );
};
SearchDatePicker.propTypes = {
  paramDate: PropTypes.shape({
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
  }).isRequired,
  setParamDate: PropTypes.func.isRequired,
};

/**
 * 목록 검색용 체크박스 컴포넌트
 */
const SearchCheckbox = ({ optionList, checkedOptions, setCheckedOptions }) => {
  /**
   * 개별 체크박스 변경 이벤트
   * @param {event} e
   */
  const changeCheck = e => {
    const { value } = e.target;
    if (checkedOptions.includes(value)) {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    } else {
      setCheckedOptions([...checkedOptions, value]);
    }
  };

  /**
   * 전체 체크박스 변경 이벤트
   * @param {event} e
   */
  const changeAllCheck = e => {
    if (e.target.checked) {
      setCheckedOptions(optionList.map(option => option.value));
    } else {
      setCheckedOptions([]);
    }
  };

  useEffect(() => {
    setCheckedOptions(optionList.map(option => option.value));
  }, []);

  return (
    <div className='flex gap-[10px] ml-[10px] h-full items-center'>
      <div className='justify-center'>
        <input
          className='mr-[5px]'
          type='checkbox'
          value='all'
          onChange={changeAllCheck}
          checked={optionList.length === checkedOptions.length}
        />
        <label>전체</label>
      </div>
      {optionList.map((option, index) => (
        <div key={index} className='justify-center'>
          <input
            className='mr-[5px]'
            type='checkbox'
            id={option.value}
            value={option.value}
            onChange={changeCheck}
            checked={checkedOptions.includes(option.value)}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

SearchCheckbox.propTypes = {
  optionList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  checkedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCheckedOptions: PropTypes.func.isRequired,
};

export { SearchDatePicker, SearchCheckbox };
