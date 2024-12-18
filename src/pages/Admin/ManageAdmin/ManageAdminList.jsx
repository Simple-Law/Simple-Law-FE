import { useLayoutEffect, useState } from "react";
import { Table, Button } from "antd";
import { AdminTag } from "components/tags/UserTag";
import AuthButton from "components/button/AuthButton";
import UserInfoEditorForm from "components/editor/UserInfoEditorForm";
import { AdminBoard, AdminPageWrap, TableEmptyDiv } from "components/styled/StyledComponents";
import { useCommonContext } from "contexts/CommonContext";
import { searchAdminAPI } from "apis/manageUserAPI";
import { postAdminAPI, putAdminAPI } from "apis/usersApi";
import { formatDate } from "utils/dateUtil";
import { useMessageApi } from "components/messaging/MessageProvider";
import { useDispatch, useSelector } from "react-redux";
import { hideSkeletonLoading, showSkeletonLoading } from "../../../redux/actions/loadingAction";
import { SkeletonLoading } from "components/layout/LoadingSpinner";
import GlobalPopup from "components/layout/GlobalPopup";
import UserNameColumn from "components/table/UserNameColumn";

const ManageAdminList = () => {
  const columns = [
    {
      width: 32,
    },
    {
      title: "이름",
      key: "id",
      render: (_, record) => <UserNameColumn mainText={record.name} subText={record.id} />,
    },
    {
      title: "이메일",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "권한",
      key: "userType",
      render: (_, record) => record.roleList.map(role => <AdminTag key={role} adminType={role} className='mb-[5px]' />),
    },
    {
      title: "가입일",
      key: "createdAt",
      render: (_, record) => <span>{formatDate(record?.createdAt)}</span>,
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
    const response = await searchAdminAPI(searchParams);
    try {
      if (response.status === 200 && response.data.status === "success") {
        setData(response.data.data.payload);
      }
    } catch (error) {
      messageApi.error(response.message);
    } finally {
      dispatch(hideSkeletonLoading());
    }
  };

  /**
   * 관리자 계정 등록
   * @param {Object} paramData
   */
  const insertAdmin = paramData => {
    dispatch(showSkeletonLoading());
    const response = postAdminAPI(paramData);
    try {
      if (response.status === 200 && response.data.status === "success") {
        messageApi.success("관리자 계정이 등록되었습니다.");
        getAdminList();
        navigator(0);
      }
    } catch (error) {
      messageApi.error(response.message);
    } finally {
      dispatch(hideSkeletonLoading());
    }
  };

  const updateAdmin = (adminKey, paramData) => {
    console.log("updateAdmin", paramData);
    const response = putAdminAPI(adminKey, paramData);
    try {
      dispatch(showSkeletonLoading());
      if (response.status === 200 && response.data.status === "success") {
        messageApi.success("관리자 계정이 수정되었습니다.");
        getAdminList();
        navigator(0);
      }
    } catch (error) {
      messageApi.error(response.message);
    } finally {
      dispatch(hideSkeletonLoading());
    }
  };

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
    const { role, ...rest } = formData;
    const paramData = {
      ...rest,
      roleList: [role],
    };
    selectedUser ? updateAdmin(selectedUser?.adminKey, paramData) : insertAdmin(paramData);
    closeModal();
  };

  return (
    <AdminPageWrap>
      <AdminBoard>
        <div className='flex justify-between items-end mb-3'>
          <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
          <AuthButton text='계정 추가' size='large' clickHandler={showModal} adminRoleList={["SUPER_ADMIN"]} />
        </div>
        {loading ? (
          <SkeletonLoading type='default' length={5} />
        ) : (
          <Table
            className='border-t-2'
            rowKey={data => data.adminKey}
            columns={columns}
            dataSource={data}
            pagination={paginationConfig}
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
      </AdminBoard>

      <GlobalPopup
        type='custom'
        openState={isModalOpen}
        title={selectedUser ? "계정 수정" : "계정 등록"}
        cancelHandler={closeModal}
        width={448}
        top={75}
      >
        <UserInfoEditorForm userData={selectedUser} onSubmit={onSubmit} closeModal={closeModal} isAdmin={true} />
      </GlobalPopup>

      <GlobalPopup
        type='confirm'
        openState={isConfirmOpen}
        title={selectedUser?.id + " 계정을 삭제하시겠습니까?"}
        okText='삭제'
        okHandler={deleteAdmin}
        cancelText='취소'
        cancelHandler={cancleDelete}
      />
    </AdminPageWrap>
  );
};

export default ManageAdminList;
