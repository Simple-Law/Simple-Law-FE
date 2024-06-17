import { Select, Tag } from "antd";

const adminTagList = [
  {
    value: "MASTER",
    label: "마스터",
    color: "processing",
  },
  {
    value: "TOP",
    label: "운영관리자",
    color: "green",
  },
  {
    value: "NORMAL",
    label: "일반관리자",
    color: "default",
  },
];

const AdminTag = ({ adminType }) => {
  const tagAttr = adminTagList.find(item => item.value === adminType);
  return (
    <Tag bordered={false} color={tagAttr.color}>
      {tagAttr.label}
    </Tag>
  );
};

export const SelectAdminTag = ({ adminType, updateAdmin }) => {
  return(
    <Select
    mode="tag"
    style={{ width: '100%' }}
    // defaultValue={<AdminTag adminType={adminType} />}
    defaultValue={adminType}
    tagRender={(props) => {
      const { value, closable, onClose } = props;
      return <AdminTag adminType={value} closable={closable} onClose={onClose} />;
    }}
    onChange={updateAdmin}
    options={adminTagList}
    optionRender={(option) => (
        <AdminTag adminType={option.value} />
    )}
  />
  )
};

export default AdminTag;
