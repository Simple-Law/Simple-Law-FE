import SvgProfile from "components/Icons/Profile";
import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * 사용자 이름, 아이디 컬럼
 */
const UserProfileColumn = ({ mainText, subText }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px" }}>
      <SvgProfile className='w-8 h-8 mr-2' />
      <div>
        <div>{mainText}</div>
        <TableColumnId>{subText}</TableColumnId>
      </div>
    </div>
  );
};

UserProfileColumn.propTypes = {
  mainText: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
};

export default UserProfileColumn;

const TableColumnId = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.02em;
  color: #94a3b8;
`;
