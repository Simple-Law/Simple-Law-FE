import { Table } from "antd";
import SvgProfile from "components/Icons/Profile";
import { LoginStatusTag } from "components/tags/StatusTag";
import UserTag from "components/tags/UserTag";
import { useState } from "react";
import styled from "styled-components";

const MnageUserList = () => {
  const [pageTitle, setPageTitle] = useState("회원관리");
  const paginationConfig = {
    pageSize: 10,
    position: ["bottomCenter"],
  };

  const columns = [
    {
      title: "이름",
      key: "userName",
      dataIndex: "userName",
      className: "userName-column",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px" }}>
          <SvgProfile className='w-8 h-8 mr-2' />
          <div>
            <div>
              <spna>{record.userName}</spna>
            </div>
            <div>
              <span className='userId'>{record.userId}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "회원구분",
      key: "userType",
      dataIndex: "userType",
      className: "userType-column",
      render: (_, record) => <UserTag userType={record.userType} />,
    },
    {
      title: "가입일",
      key: "joinDate",
      dataIndex: "joinDate",
      className: "joinDate-column",
    },
    {
      title: "최근 접속일",
      key: "accessDate",
      dataIndex: "accessDate",
      className: "accessDate-column",
    },
    {
      title: "상태",
      key: "loginStatus",
      dataIndex: "loginStatus",
      className: "login-status",
      render: (_, record) => <LoginStatusTag status={record.loginStatus} />,
    },
  ];

  const mockData = [
    {
      userId: "law123",
      userName: "김변호",
      userType: "LAWYER",
      email: "law123@simplelaw.com",
      joinDate: "2023.09.01",
      accessDate: "2024.06.16",
      loginStatus: false,
    },
    {
      userId: "mem123",
      userName: "김의뢰",
      userType: "MEMBER",
      email: "mem123@simplelaw.com",
      joinDate: "2023.09.01",
      accessDate: "2024.06.16",
      loginStatus: true,
    },
  ];

  return (
    <>
      <BoardDiv className='mt-6 mx-8 grow overflow-hidden'>
        <div className='flex justify-between items-end mb-3'>
          <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
        </div>
        <Table
          dataSource={mockData}
          columns={columns}
          pagination={paginationConfig}
          onRow={(record, rowIndex) => {
            return {
              onClick: e => {
                console.log(e.target.value);
                console.log(record);
                console.log(rowIndex);
              }, // click row
              onDoubleClick: e => {
                console.log(e.target.value);
                console.log(record);
                console.log(rowIndex);
              }, // double click row
            };
          }}
        />
      </BoardDiv>
    </>
  );
};

const BoardDiv = styled.div`
  .ant-spin-container {
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .ant-pagination .ant-pagination-item-active {
    border-color: transparent;
  }
`;

export default MnageUserList;
