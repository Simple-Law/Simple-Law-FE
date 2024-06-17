import { Tag } from "antd";

const adminList = [
  {
    typeCode: "MASTER",
    typeCodeNm: "마스터",
    styleColor: "processing",
  },
  {
    typeCode: "TOP",
    typeCodeNm: "최고 관리자",
    styleColor: "green",
  },
  {
    typeCode: "NORMAL",
    typeCodeNm: "일반 관리자",
    styleColor: "default",
  },
];

const AdminTag = ({ adminType }) => {
  console.log("typeCode");
  console.log(adminType);
  const tagAttr = adminList.find(item => item.typeCode === adminType);
  console.log(tagAttr);

  return (
    <Tag bordered={false} color={tagAttr.styleColor}>
      {tagAttr.typeCodeNm}
    </Tag>
  );
};

// const DropdownAdminTag = ({ typeCode }) => {};

export default AdminTag;
