import PropTypes from "prop-types";
import { getRoleList } from "utils/userTypes";
import { Select, Tag } from "antd";
import styled from "styled-components";

const userStatusList = [
  {
    value: true,
    label: "활성화",
    color: "tag-gray",
  },
  {
    value: false,
    label: "비활성화",
    color: "tag-red",
  },
];

const userTypeList = getRoleList("USER");
const adminTypeList = getRoleList("ADMIN");

const UserStatusTag = ({ status }) => {
  const tagAttr = userStatusList.find(item => item.value === status);
  return <StyledTag className={`status-tag ${tagAttr?.color} `}>{tagAttr?.label}</StyledTag>;
};
UserStatusTag.propTypes = {
  status: PropTypes.bool.isRequired,
};

const UserTag = ({ userType, className = "max-w-[50px]" }) => {
  const tagAttr = userTypeList.find(item => item.value === userType);
  return <StyledTag className={`user-tag ${tagAttr?.color} ${className}`}>{tagAttr?.label}</StyledTag>;
};
UserTag.propTypes = {
  userType: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export const AdminTag = ({ adminType }) => {
  const tagAttr = adminTypeList.find(item => item.value === adminType);
  return <StyledTag className={`user-tag ${tagAttr?.color} max-w-[70px]`}>{tagAttr?.label}</StyledTag>;
};
AdminTag.propTypes = {
  adminType: PropTypes.string.isRequired,
};

export const SelectAdminTag = ({ onChange, value, defaultValue = "NORMAL_ADMIN" }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      {adminTypeList.map((item, index) => {
        return (
          <Select.Option key={index} value={item.value}>
            <AdminTag adminType={item.value} className={`user-tag ${item.color}`} />
          </Select.Option>
        );
      })}
    </Select>
  );
};
SelectAdminTag.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
};

export default UserTag;

export const StyledTag = styled(Tag)`
  &.user-tag {
    display: flex;
    gap: 10px;
    height: 22px;
    padding: 4px 6px;
    font-size: 13px;
    font-weight: 400;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 4px;
    margin-inline-end: 0px; !important;
  }

  &.header-tag{
    margin-top:5px;
  }

  &.user-tag.tag-blue {
    color: #287fff;
    background: rgba(40, 127, 255, 0.12);
  }

  &.user-tag.tag-green {
    color: #00bf40;
    background: rgba(0, 191, 64, 0.12);
  }

    &.user-tag.tag-gray-black {
    color: #4A5055;
    background: rgba(110, 119, 128, 0.1)
  }

  &.user-tag.tag-gray {
    color: #94a3b8;
    background: rgba(148, 163, 184, 0.1);
  }
  &.user-tag.tag-orange {
    color: #ff9200;
    background: rgba(255, 146, 0, 0.12);
  }
    &.user-tag.tag-red {
    color: #ff4242;
    background: rgba(255, 66, 66, 0.12);
  }
`;
