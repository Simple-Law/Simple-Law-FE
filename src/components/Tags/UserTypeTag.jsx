import { Select, Tag } from "antd";
import styled from "styled-components";

const userTypeList = [
  {
    value: "MEMBER",
    label: "의뢰인",
  },
  {
    value: "LAWYER",
    label: "변호사",
  },
];

const adminTypeList = [
  {
    value: "MASTER_ADMIN",
    label: "마스터",
  },
  {
    value: "SUPER_ADMIN",
    label: "최고관리자",
  },
  {
    value: "NORMAL_ADMIN",
    label: "일반관리자",
  },
];

const StyledTag = styled(Tag)`
  &.admin-tag {
    display: flex;
    padding: 4px 6px;
    font-size: 13px;
    font-weight: 400;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: none;
    border-radius: 4px;
  }
  &.admin-tag.MASTER_ADMIN {
    color: #287fff;
    background: rgba(40, 127, 255, 0.12);
  }

  &.admin-tag.SUPER_ADMIN {
    color: #00bf40;
    background: rgba(0, 191, 64, 0.12);
  }

  &.admin-tag.NORMAL_ADMIN {
    color: #94a3b8;
    background: rgba(148, 163, 184, 0.1);
  }
`;

//TODO: kmee - default 일반사용자태그 컴포넌트
const AdminTag = ({ adminType }) => {
  const tagAttr = adminTypeList.find(item => item.value === adminType);
  return <StyledTag className={`admin-tag ${adminType}`}>{tagAttr.label}</StyledTag>;
};

export const SelectAdminTag = ({ adminType, updateAdmin }) => {
  return (
    <Select defaultValue={adminType} onChange={updateAdmin} style={{ width: "100%" }}>
      {adminTypeList.map((item, index) => {
        return (
          <styledOption key={index} value={item.value} className={`admin-tag ${item.value}`}>
            <AdminTag adminType={item.value} />
          </styledOption>
        );
      })}
    </Select>
  );
};

export default AdminTag;
