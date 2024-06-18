import { Select, Tag } from "antd";
import styled from "styled-components";

const userTypeList = [
  {
    value: "MEMBER",
    label: "의뢰인",
    color: "tag-orange",
  },
  {
    value: "LAWYER",
    label: "변호사",
    color: "tag-blue",
  },
];

const adminTypeList = [
  {
    value: "MASTER_ADMIN",
    label: "마스터",
    color: "tag-blue",
  },
  {
    value: "SUPER_ADMIN",
    label: "최고관리자",
    color: "tag-green",
  },
  {
    value: "NORMAL_ADMIN",
    label: "일반관리자",
    color: "tag-gray",
  },
];

const UserTag = ({ userType }) => {
  const tagAttr = userTypeList.find(item => item.value === userType);
  return <StyledTag className={`user-tag ${tagAttr.color}`}>{tagAttr.label}</StyledTag>;
}

export const AdminTag = ({ adminType }) => {
  const tagAttr = adminTypeList.find(item => item.value === adminType);
  return <StyledTag className={`user-tag ${tagAttr.color}`}>{tagAttr.label}</StyledTag>;
};

export const SelectAdminTag = ({ adminType, updateAdmin }) => {
  return (
    <Select defaultValue={adminType} onChange={updateAdmin}>
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

export default UserTag;

const StyledTag = styled(Tag)`
  &.user-tag {
    display: flex;
    min-width: 100px;
    padding: 4px 6px;
    font-size: 13px;
    font-weight: 400;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: none;
    border-radius: 4px;
  }
  &.user-tag.tag-blue {
    color: #287fff;
    background: rgba(40, 127, 255, 0.12);
  }

  &.user-tag.tag-green {
    color: #00bf40;
    background: rgba(0, 191, 64, 0.12);
  }

  &.user-tag.tag-gray {
    color: #94a3b8;
    background: rgba(148, 163, 184, 0.1);
  }
    &.user-tag.tag-orange {
    color: #ff9200;
    background: rgba(255, 146, 0, 0.12);
    }
`;