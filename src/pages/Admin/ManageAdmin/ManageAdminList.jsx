import { useCallback, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Table, Button, Modal } from "antd";
import { AdminTag } from "components/tags/UserTag";
import AuthButton from "components/button/AuthButton";
import UserInfoEditorForm from "components/editor/UserInfoEditorForm";
import SvgProfile from "components/Icons/Profile";
import { useCommonContext } from "contexts/CommonContext";

const ManageAdminList = () => {
  const columns = [
    {
      width: 48,
    },
    {
      title: "이름",
      key: "id",
      dataIndex: "id",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <SvgProfile className='mr-2' width='32' height='32' />
          <div>
            <div>{record.name}</div>
            <IdDiv>{record.id}</IdDiv>
          </div>
        </div>
      ),
    },
    {
      title: "이메일",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "권한",
      key: "userType",
      render: (_, record) => <AdminTag adminType={record.userType} />,
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
      key: "adminId",
      render: (_, record) => (
        <Button
          danger
          size='small'
          onClick={() => {
            deleteAdmin(record.key, record.id);
          }}
        >
          삭제
        </Button>
      ),
    },
  ];

  const mockData = [
    {
      key: 1,
      id: "admin2",
      name: "김최고",
      userType: "SUPER_ADMIN",
      email: "admin22@simplelaw.com",
      joinDate: "2023.09.01",
      accessDate: "2024.06.16",
    },
    {
      key: 2,
      id: "admin3",
      name: "김일반",
      userType: "NORMAL_ADMIN",
      email: "admin33@simplelaw.com",
      joinDate: "2024.09.01",
      accessDate: "2024.06.16",
    },
    {
      key: 3,
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
  const { confirm } = Modal;

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

  /**
   * 관리자 계정 삭제
   * @param {String} targetKey 유저 식별키
   * @param {String} targetId 유저 아이디
   */
  const deleteAdmin = (targetKey, targetId) => {
    confirm({
      title: `${targetId} 계정을 삭제하시겠습니까?`,
      bodyStyle: { textAlign: "center" },
      okText: "삭제",
      okType: "primary",
      onOk() {
        console.log("OK : ", targetKey + "로 api 호출");
      },
      cancelText: "취소",
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  /**
   * 관리자 계정 등록/수정 modal 열기
   */
  const showModal = () => {
    setIsModalOpen(true);
  };
  /**
   * 관리자 계정 등록/수정 modal 닫기
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  /**
   * 관리자 계정 등록/수정 저장
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
          <AuthButton text='계정 추가' size='large' clickHandler={showModal} adminRoleList={["SUPER_ADMIN"]} />
        </div>
        <Table
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
        <UserInfoEditorForm
          className='flex justify-center'
          userData={selectedUser}
          onSubmit={onSubmit}
          closeModal={closeModal}
          isAdmin={true}
        />
      </StyledModal>
    </>
  );
};

export default ManageAdminList;

const StyledModal = styled(Modal)`
    border-radius: 16px;
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
  .ant-table-thead {
    border: 1px solid red;
  }
`;

export const IdDiv = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.02em;
  color: #94a3b8;
`;
