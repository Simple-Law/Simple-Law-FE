import SvgProfile from "components/Icons/Profile";
import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * 사용자 이름, 아이디 컬럼
 */
const UserNameColumn = ({ userName, userId }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px" }}>
      <SvgProfile className='w-8 h-8 mr-2' />
      <div>
        <div>{userName}</div>
        <TableColumnId>{userId}</TableColumnId>
      </div>
    </div>
  );
};

UserNameColumn.propTypes = {
  userName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default UserNameColumn;

const TableColumnId = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.02em;
  color: #94a3b8;
`;
