import { useState } from "react";
import styled from "styled-components";
import { Table, Button } from "antd";
import profileImg from "../../../assets/images/icons/profile.svg";

const MngAdmin = () => {
  //TODO: kmee- 로그인한 관리자 권한에 따라 등록,수정,삭제 처리

  const [pageTitle, setPageTitle] = useState("관리자 계정 관리");
  const columns = [
    {
      title: "이름",
      key: "userId",
      dataIndex: "userName",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={profileImg} alt='profile' style={{ marginRight: "10px" }} />
          <div>
            <div>{record.userName}</div>
            <div>{record.userId}</div>
          </div>
        </div>
      ),
    },
    {
      title: "이메일",
      key: "email",
      dataIndex: "email",
    },
    //TODO: kmee- 드롭박스로 권한 수정 컴포넌트
    {
      title: "권한",
      key: "role",
      dataIndex: "role",
    },
    {
      title: "가입일",
      key: "joinDate",
      dataIndex: "joinDate",
    },
    {
      title: "최근 접속일",
      key: "accessDate",
      dataIndex: "accessDate",
    },
    {
      title: "삭제",
      key: "userId",
      render: () => (
        <Button danger size='small'>
          삭제
        </Button>
      ),
    },
  ];
  const mockData = [
    {
      userId: "admin1",
      userName: "마스터",
      role: "MASTER",
      email: "admin1@simplelaw.com",
      joinDate: "2021-09-01",
      accessDate: "2024-06-16",
    },
    {
      userId: "admin2",
      userName: "김최고",
      role: "TOP",
      email: "admin22@simplelaw.com",
      joinDate: "2023-09-01",
      accessDate: "2024-06-16",
    },
    {
      userId: "admin3",
      userName: "김일반",
      role: "NORMAL",
      email: "admin33@simplelaw.com",
      joinDate: "2024-09-01",
      accessDate: "2024-06-16",
    },
    {
      userId: "admin4",
      userName: "김노말",
      role: "NORMAL",
      email: "admin44@simplelaw.com",
      joinDate: "2023-09-01",
      accessDate: "2024-06-16",
    },
  ];

  return (
    <BoardDiv className='mt-6 mx-8 grow overflow-hidden'>
      <div className='flex justify-between items-end mb-3'>
        <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
        <Button type='primary' size='small'>
          계정 추가
        </Button>
      </div>

      <Table dataSource={mockData} columns={columns} />
    </BoardDiv>
  );
};

export default MngAdmin;

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

  .status-column {
    max-width: 150px;
    flex-basis: 150px;
  }

  .category-column {
    max-width: 320px;
    flex-basis: 320px;
  }
  .title-column {
    flex: 1 1 auto;
    min-width: 0;
  }
  .time-column {
    max-width: 140px;
    flex-basis: 140px;
  }
`;
