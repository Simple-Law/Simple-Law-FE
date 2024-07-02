import { useCallback, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Table, Button, Modal } from "antd";
import { AdminTag } from "components/tags/UserTag";
import AuthButton from "components/button/AuthButton";
import UserInfoEditorForm from "components/editor/UserInfoEditorForm";
import SvgProfile from "components/Icons/Profile";
import { useCommonContext } from "contexts/CommonContext";

const MnageAdminList = () => {
  const columns = [
    {
      title: "이름",
      key: "id",
      dataIndex: "name",
      className: "name-column",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px" }}>
          <SvgProfile className='mr-2' width='32' height='32' />
          <div>
            <div>{record.name}</div>
            <div>{record.id}</div>
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
      key: "userType",
      className: "user-type-column",
      render: (_, record) => <AdminTag adminType={record.userType} />,
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
      title: "삭제",
      key: "delete",
      className: "delete-column",
      render: () => (
        <Button danger size='small' onClick={deleteAdmin}>
          삭제
        </Button>
      ),
    },
  ];

  const mockData = [
    {
      id: "admin2",
      name: "김최고",
      userType: "SUPER_ADMIN",
      email: "admin22@simplelaw.com",
      joinDate: "2023.09.01",
      accessDate: "2024.06.16",
    },
    {
      id: "admin3",
      name: "김일반",
      userType: "NORMAL_ADMIN",
      email: "admin33@simplelaw.com",
      joinDate: "2024.09.01",
      accessDate: "2024.06.16",
    },
    {
      id: "admin4",
      name: "김노말",
      userType: "NORMAL_ADMIN",
      email: "admin44@simplelaw.com",
      joinDate: "2023.09.01",
      accessDate: "2024.06.16",
    },
  ];

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  //TODO: kmee- 로그인한 관리자 권한에 따라 등록,수정,삭제 처리
  const pageTitle = "관리자 계정 관리";
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

  const insertAdmin = () => {
    console.log("insertAdmin");
  };

  const updateAdmin = useCallback(id => {
    console.log("updateAdmin", id);
  }, []);

  const deleteAdmin = () => {
    console.log("deleteAdmin");
  };

  /**
   * 유저 정보 등록/수정 modal 열기
   */
  const showModal = () => {
    setIsModalOpen(true);
  };
  /**
   * 유저 정보 등록/수정 modal 닫기
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  /**
   * 유저 정보  저장
   * @param {Object} formData : modal에서 입력한 formData
   */
  const onSubmit = formData => {
    console.log("formData");
    console.log(formData);
    closeModal();
  };

  return (
    <>
      <BoardDiv className='mt-6 mx-8 grow overflow-hidden'>
        <div className='flex justify-between items-end mb-3'>
          <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
          <AuthButton text='계정 추가' size='large' clickHandler={showModal} authRoles={["SUPER_ADMIN"]} />
        </div>
        <Table
          // onmouseover="this.style.color='red'"
          // onmouseout="this.style.color='blue';"
          // style={{ hover: true }}
          dataSource={data}
          columns={columns}
          pagination={paginationConfig}
          onRow={record => {
            return {
              onDoubleClick: () => {
                setSelectedUser(record);
                showModal();
              },
            };
          }}
        />
      </BoardDiv>
      <StyledModal open={isModalOpen} onCancel={closeModal} footer={null}>
        <h5 className='text-center font-bold text-[20px] mb-4'>{selectedUser ? "계정 수정" : "계정 등록"}</h5>
        <UserInfoEditorForm userData={selectedUser} onSubmit={onSubmit} closeModal={closeModal} isAdmin={true} />
      </StyledModal>
    </>
  );
};

export default MnageAdminList;

const StyledModal = styled(Modal)`
    border-radius: 16px;
    opacity: 0.5;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.04);
  }
`;

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
  .user-type-column {
    max-width: 150px;
    flex-basis: 150px;
  }
  .join-date-column {
    max-width: 150px;
    flex-basis: 150px;
  }
  .access-date-column {
    max-width: 150px;
    flex-basis: 150px;
  }
  .delete-column {
    max-width: 100px;
    flex-basis: 100px;
  }
`;