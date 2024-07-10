import { useCallback, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Table, Button, Modal } from "antd";
import { AdminTag } from "components/tags/UserTag";
import AuthButton from "components/button/AuthButton";
import UserInfoEditorForm from "components/editor/UserInfoEditorForm";
import { TableColumnId, TableEmptyDiv } from "components/styled/StyledComponents";
import SvgProfile from "components/Icons/Profile";
import { useCommonContext } from "contexts/CommonContext";
import { getAdminsApi } from "apis/manageAdminAPI";
import { formatDate } from "utils/dateUtil";
import { useMessageApi } from "components/messaging/MessageProvider";
import { useDispatch, useSelector } from "react-redux";
import { hideSkeletonLoading, showSkeletonLoading } from "../../../redux/actions/loadingAction";
import { SkeletonLoading } from "components/layout/LoadingSpinner";

const ManageAdminList = () => {
  const columns = [
    {
      width: 48,
    },
    {
      title: "이름",
      key: "id",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <SvgProfile className='mr-2' width='32' height='32' />
          <div>
            <div>{record?.name}</div>
            <TableColumnId>{record?.id}</TableColumnId>
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
      render: (_, record) => <AdminTag adminType={record?.roleList?.[0]?.role} />,
    },
    {
      title: "가입일",
      key: "joinDate",
      dataIndex: "joinDate",
    },
    {
      title: "최근 접속일",
      key: "lastAccessDate",
      render: (_, record) => <span>{formatDate(record?.lastAccessDate)}</span>,
    },
    {
      title: "삭제",
      key: "adminId",
      render: (_, record) => (
        <Button
          danger
          size='small'
          onClick={() => {
            setSelectedUser(record);
            setIsConfirmOpen(true);
          }}
        >
          삭제
        </Button>
      ),
    },
  ];

  const messageApi = useMessageApi();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.SkeletonLoading);
  const { paginationConfig } = useCommonContext();
  const initialSearchParams = { pageNumber: 1, pageSize: paginationConfig.pageSize };

  const pageTitle = "관리자 계정 관리";
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useLayoutEffect(() => {
    getAdminList();
  }, [searchParams]);

  /**
   * 관리자 계정관리 목록 조회
   */
  const getAdminList = async () => {
    dispatch(showSkeletonLoading());
    try {
      const response = await getAdminsApi(searchParams);
      if (response.status === 200 && response.data.status === "success") {
        setData(response.data.data.payload);
      }
    } catch (error) {
      messageApi.error("목록 조회 중 오류가 발생했습니다.");
      console.error("getAdminList error : ", error);
    } finally {
      dispatch(hideSkeletonLoading());
    }
  };

  const insertAdmin = () => {
    console.log("insertAdmin");
  };

  const updateAdmin = useCallback(id => {
    console.log("updateAdmin", id);
  }, []);

  const deleteAdmin = () => {
    console.log("deleteAdmin API");
    setIsConfirmOpen(false);
  };

  /**
   * 관리자 삭제 confirm 취소
   */
  const cancleDelete = () => {
    setSelectedUser(null);
    setIsConfirmOpen(false);
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
    setSelectedUser(null);
    setIsModalOpen(false);
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
        {loading ? (
          <SkeletonLoading type='input' />
        ) : (
          <Table
            rowKey='id'
            columns={columns}
            dataSource={data}
            pagination={paginationConfig}
            style={{ cursor: "pointer" }}
            locale={{
              emptyText: (
                <TableEmptyDiv>
                  <p dangerouslySetInnerHTML={{ __html: "관리자 계정이 없습니다." }} />
                </TableEmptyDiv>
              ),
            }}
            onRow={record => {
              return {
                onDoubleClick: () => {
                  setSelectedUser(record);
                  showModal();
                },
              };
            }}
          />
        )}
      </BoardDiv>

      <StyledModal open={isModalOpen} onCancel={closeModal} footer={null} width={448}>
        <h5 className='text-center font-bold text-[20px]'>{selectedUser ? "계정 수정" : "계정 등록"}</h5>
        <UserInfoEditorForm userData={selectedUser} onSubmit={onSubmit} closeModal={closeModal} isAdmin={true} />
      </StyledModal>

      <Modal open={isConfirmOpen} footer={null} width={400} closeIcon={false}>
        <div className='p-[15px]'>
          <p className='text-center font-bold text-[20px]'>{selectedUser?.id} 계정을 삭제하시겠습니까?</p>
          <div className='flex gap-[30px] justify-center mt-[30px]'>
            <Button className='w-[80px] h-[40px] p-0' onClick={cancleDelete}>
              취소
            </Button>
            <Button className='w-[80px] h-[40px] p-0' type='primary' onClick={deleteAdmin}>
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ManageAdminList;

const StyledModal = styled(Modal)`
  border-radius: 16px;
  top: 75px;
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
