import { useEffect, useState } from "react";
import { Button, Checkbox, DatePicker } from "antd";
import PropTypes from "prop-types";
import { dateFormat } from "utils/dateUtil";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import styled from "styled-components";

dayjs.extend(weekday);
dayjs.extend(localeData);

/**
 * 목록 검색용 기간 선택 컴포넌트
 */
const SearchDatePicker = ({ paramDate, setParamDate }) => {
  const { RangePicker } = DatePicker;
  const today = dayjs();

  const [dateTagList, setDateTagList] = useState([
    { label: "오늘", value: today, active: true },
    { label: "1주", value: today.subtract(1, "week"), active: false },
    { label: "1개월", value: today.subtract(1, "month"), active: false },
    { label: "6개월", value: today.subtract(6, "month"), active: false },
  ]);

  /**
   * 날짜 태그 클릭 이벤트
   * @param {object} selected - 선택된 날짜 정보
   */
  const clickDateTag = selected => {
    setDateTagList(dateTagList.map(date => ({ ...date, active: date.value === selected.value })));

    setParamDate({
      ...paramDate,
      startDate: selected.value,
    });
  };

  return (
    <div className='flex'>
      <RangePicker
        className='mr-2'
        format={dateFormat}
        defaultValue={[paramDate.startDate, paramDate.endDate]}
        value={[paramDate.startDate, paramDate.endDate]}
        maxDate={today}
      />

      <div className='justify-start items-center flex'>
        {dateTagList.map((date, idx) => (
          <StyledButton
            key={idx}
            className={`date-tag active-${date.active}`}
            onClick={() => {
              clickDateTag(date);
            }}
          >
            <StyledSpan className={` active-${date.active}`}>{date.label}</StyledSpan>
          </StyledButton>
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

const StyledButton = styled.button`
  &.date-tag {
    display: flex;
    padding: 8px 16px;
    justify-content: center;
    align-items: center;
    border: 1px solid #d4dde6;
  }
    
  &.date-tag:first-child {
    border-radius: 6px 0px 0px 6px;
  }

  &.date-tag:last-child {
    border-radius: 0px 6px 6px 0px;
  }

  &.active-true {
    background-color: #287eff;
  }

  &.active-false {
    background: #FFF;;
  }
}
`;

const StyledSpan = styled.span`
  width: 36px;
  text-align: center;

  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 146%;
  letter-spacing: -0.28px;

  &.active-true {
    color: #ffffff;
  }

  &.active-false {
    color: var(--Text-Label, var(--Palette-Coolgray-700, #6e7780));
  }
`;

/**
 * 목록 검색용 체크박스 컴포넌트
 */
const SearchCheckbox = ({ optionList, checkedOptions, setCheckedOptions }) => {
  const CheckboxGroup = Checkbox.Group;
  const indeterminate = checkedOptions.length > 0 && checkedOptions.length < optionList.length;
  const checkAll = optionList.length === checkedOptions.length;

  // useEffect(() => {
  //   setCheckedOptions(optionList.map(option => option.value));
  // }, []);

  /**
   * 개별 체크박스 변경 이벤트
   * @param {string[]} list
   */
  const onChange = list => {
    setCheckedOptions(list);
  };

  /**
   * 전체 체크박스 변경 이벤트
   * @param {event} e
   */
  const onCheckAllChange = e => {
    if (e.target.checked) {
      setCheckedOptions(optionList.map(option => option.value));
    } else {
      setCheckedOptions([]);
    }
  };

  return (
    <>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        전체
      </Checkbox>
      <CheckboxGroup options={optionList} value={checkedOptions} onChange={onChange} />
    </>
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

/**
 * 목록 검색용 버튼 컴포넌트
 */
const SearchButtons = ({ onSearch, onReset }) => {
  return (
    <div className='justify-start items-center gap-2 inline-flex'>
      {onReset && (
        <Button
          className='w-[88px] h-11 px-8 py-3 rounded-lg justify-center items-center gap-1 flex leading-tight'
          onClick={onReset}
        >
          초기화
        </Button>
      )}
      <Button
        type='primary'
        className='w-[88px] h-11 px-8 py-3 rounded-lg justify-center items-center gap-1 flex leading-tight'
        onClick={onSearch}
      >
        검색
      </Button>
    </div>
  );
};

SearchButtons.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func,
};

export { SearchDatePicker, SearchCheckbox, SearchButtons };
