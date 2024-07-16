import { useLayoutEffect, useState } from "react";
import { Table } from "antd";
import UserTag from "components/tags/UserTag";
import { LoginStatusTag } from "components/tags/StatusTag";
import { AdminBoard, AdminPageWrap, TableColumnId } from "components/styled/StyledComponents";
import { useCommonContext } from "contexts/CommonContext";
import SvgProfile from "components/Icons/Profile";
import styled from "styled-components";

const ManageUserList = () => {
  const columns = [
    {
      title: "이름",
      key: "name",
      dataIndex: "name",
      className: "name-column",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px" }}>
          <SvgProfile className='w-8 h-8 mr-2' />
          <div>
            <div>{record.name}</div>
            <TableColumnId>{record.id}</TableColumnId>
          </div>
        </div>
      ),
    },
    {
      title: "회원구분",
      key: "userType",
      dataIndex: "userType",
      className: "user-type-column",
      render: (_, record) => <UserTag userType={record.userType} />,
    },
    {
      title: "가입일",
      key: "joinDate",
      dataIndex: "joinDate",
      className: "join-date-column",
    },
    {
      title: "최근 접속일",
      key: "accessDate",
      dataIndex: "accessDate",
      className: "access-date-column",
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
      id: "law123",
      name: "김변호",
      userType: "LAWYER",
      email: "law123@simplelaw.com",
      joinDate: "2023.09.01",
      accessDate: "2024.06.16",
      loginStatus: false,
    },
    {
      id: "mem123",
      name: "김의뢰",
      userType: "MEMBER",
      email: "mem123@simplelaw.com",
      joinDate: "2023.09.01",
      accessDate: "2024.06.16",
      loginStatus: true,
    },
  ];

  const [data, setData] = useState([]);
  const [pageTitle, setPageTitle] = useState("회원관리");
  const { paginationConfig } = useCommonContext();

  useLayoutEffect(() => {
    getAdminList();
    console.log("mockData", mockData);
    console.log("paginationConfig", paginationConfig);
  }, []);

  const getAdminList = async () => {
    const response = await mockData;
    try {
      //TODO: kmee - API status 체크
      response.forEach(item => (item.key = item.id));
      setData(response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AdminPageWrap>
      <AdminBoard>
        <div className='flex justify-between items-end mb-3'>
          <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
        </div>
        <Table
          dataSource={data}
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
      </AdminBoard>
    </AdminPageWrap>
  );
};

export default ManageUserList;
