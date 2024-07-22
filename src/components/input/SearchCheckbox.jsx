import { useEffect } from "react";
import PropTypes from "prop-types";

const SearchCheckbox = ({ optionList, checkedOptions, setCheckedOptions }) => {
  const clickCheck = e => {
    const { value } = e.target;

    if (checkedOptions.includes(value)) {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    } else {
      setCheckedOptions([...checkedOptions, value]);
    }
  };

  const clickAllCheck = e => {
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
          onChange={clickAllCheck}
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
            onChange={clickCheck}
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

export default SearchCheckbox;
