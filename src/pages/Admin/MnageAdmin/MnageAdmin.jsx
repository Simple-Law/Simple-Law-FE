import { React, useCallback, useState } from "react";
import styled from "styled-components";
import { Table, Button } from "antd";
import profileImg from "../../../assets/images/icons/profile.svg";

import { SelectAdminTag } from "components/tags2/UserTag";
import AuthButton from "components/button2/AuthButton";

const MnageAdmin = () => {
  //TODO: kmee- 로그인한 관리자 권한에 따라 등록,수정,삭제 처리

  const [pageTitle] = useState("관리자 계정 관리");
  const paginationConfig = {
    pageSize: 10,
    position: ["bottomCenter"],
  };
  const columns = [
    {
      title: "이름",
      key: "adminId",
      dataIndex: "adminName",
      className: "name-column",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px" }}>
          <img src={profileImg} alt='profile' style={{ marginRight: "10px" }} />
          <div>
            <div>{record.adminName}</div>
            <div>{record.adminId}</div>
          </div>
        </div>
      ),
    },
    {
      title: "이메일",
      key: "email",
      dataIndex: "email",
      className: "email-column",
    },
    {
      title: "권한",
      key: "adminType",
      className: "adminTag-column",
      render: (_, record) => (
        <SelectAdminTag adminType={record.adminType} updateAdmin={() => updateAdmin(record.adminId)} />
      ),
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
      title: "삭제",
      key: "adminId",
      className: "deleteBtn-column",
      render: () => (
        <Button danger size='small' onClick={deleteAdmin}>
          삭제
        </Button>
      ),
    },
  ];
  const mockData = [
    {
      adminId: "admin2",
      adminName: "김최고",
      adminType: "SUPER_ADMIN",
      email: "admin22@simplelaw.com",
      joinDate: "2023.09.01",
      accessDate: "2024.06.16",
    },
    {
      adminId: "admin3",
      adminName: "김일반",
      adminType: "NORMAL_ADMIN",
      email: "admin33@simplelaw.com",
      joinDate: "2024.09.01",
      accessDate: "2024.06.16",
    },
    {
      adminId: "admin4",
      adminName: "김노말",
      adminType: "NORMAL_ADMIN",
      email: "admin44@simplelaw.com",
      joinDate: "2023.09.01",
      accessDate: "2024.06.16",
    },
  ];

  const insertAdmin = () => {
    console.log("insertAdmin");
  };

  const updateAdmin = useCallback(adminId => {
    console.log("updateAdmin", adminId);
  }, []);

  const deleteAdmin = () => {
    console.log("deleteAdmin");
  };

  return (
    <BoardDiv className='mt-6 mx-8 grow overflow-hidden'>
      <div className='flex justify-between items-end mb-3'>
        <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
        <AuthButton text='계정 추가' clickHandler={insertAdmin} authRoles={["SUPER_ADMIN"]} />
      </div>
      <Table dataSource={mockData} columns={columns} pagination={paginationConfig} />
    </BoardDiv>
  );
};

export default MnageAdmin;

//TODO: kmee- 테이블 컬럼에 맞춰 수정
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

  .name-column {
    max-width: 150px;
    flex-basis: 150px;
  }
  .email-column {
    max-width: 300px;
    flex-basis: 300px;
  }
  .adminTag-column {
    max-width: 150px;
    flex-basis: 150px;
  }
  .joinDate-column {
    max-width: 150px;
    flex-basis: 150px;
  }
  .accessDate-column {
    max-width: 150px;
    flex-basis: 150px;
  }
  .deleteBtn-column {
    max-width: 100px;
    flex-basis: 100px;
  }
`;
