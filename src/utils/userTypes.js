const userTypeList = [
  {
    value: "MEMBER",
    label: "의뢰인",
    color: "tag-blue",
  },
  {
    value: "LAWYER",
    label: "변호사",
    color: "tag-orange",
  },
  {
    value: "ADMIN",
    label: "관리자",
    color: "tag-gray-black",
  },
];

const adminTypeList = [
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
  {
    value: "LAWYER_ADMIN",
    label: "변호사관리자",
    color: "tag-blue",
  },
];

/**
 * 유저 RoleList getter
 * @param {String} userType
 * @returns
 */
const getRoleList = userType => {
  switch (userType) {
    case "ADMIN":
      return adminTypeList;
    case "USER":
      return userTypeList;
    default:
      return [];
  }
};

export { getRoleList };
