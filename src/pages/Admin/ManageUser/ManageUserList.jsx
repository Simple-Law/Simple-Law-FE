import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Table } from "antd";
import UserTag from "components/tags/UserTag";
import { LoginStatusTag } from "components/tags/StatusTag";
import { AdminBoard, AdminPageWrap, TableEmptyDiv } from "components/styled/StyledComponents";
import { useCommonContext } from "contexts/CommonContext";
import { useMessageApi } from "components/messaging/MessageProvider";
import { useDispatch, useSelector } from "react-redux";
import { hideSkeletonLoading, showSkeletonLoading } from "../../../redux/actions/loadingAction";
import { SkeletonLoading } from "components/layout/LoadingSpinner";
import styled from "styled-components";
import UserNameColumn from "components/table/UserNameColumn";
import SearchCheckbox from "components/input/SearchCheckbox";

const ManageUserList = () => {
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

  const columns = [
    {
      width: 32,
    },
    {
      title: "이름",
      key: "name",
      dataIndex: "name",
      render: (_, record) => <UserNameColumn userName={record.name} userId={record.id} />,
    },
    {
      title: "회원구분",
      key: "userType",
      dataIndex: "userType",
      render: (_, record) => <UserTag userType={record.userType} />,
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
      title: "상태",
      key: "loginStatus",
      dataIndex: "loginStatus",
      render: (_, record) => <LoginStatusTag status={record.loginStatus} />,
    },
  ];

  const messageApi = useMessageApi();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.SkeletonLoading);
  const { paginationConfig } = useCommonContext();
  const pageTitle = "전체 사용자";

  const userOptions = [
    { label: "의뢰인", value: "MEMBER" },
    { label: "변호사", value: "LAWYER" },
  ];
  const statusOptions = [
    { label: "활성화", value: "ON" },
    { label: "비활성화", value: "OFF" },
  ];
  const [typeList, setTypeList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const initialSearchParams = {
    typeList: typeList,
    statusList: statusList,
    pageNumber: 1,
    pageSize: paginationConfig.pageSize,
  };
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  const [selectedUser, setSelectedUser] = useState({});
  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    getAdminList();
  }, []);

  useEffect(() => {
    setSearchParams({ ...searchParams, typeList, statusList });
  }, [typeList, statusList]);

  /**
   * 회원관리 목록 조회
   */
  const getAdminList = async () => {
    console.log("getAdminList : ", searchParams);
    dispatch(showSkeletonLoading());
    const response = await mockData;
    try {
      response.forEach(item => (item.key = item.id));
      setData(response);
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(hideSkeletonLoading());
    }
  };

  return (
    <AdminPageWrap>
      <AdminBoard>
        <div>
          <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
          <div className='my-3'>
            <div className='w-full'>
              <div className='flex'>
                <ThDiv className='w-1/12 border border-solid border-black'>회원구분</ThDiv>
                <TdDiv className='w-5/12 border-y border-solid border-black'>
                  <SearchCheckbox optionList={userOptions} checkedOptions={typeList} setCheckedOptions={setTypeList} />
                </TdDiv>
                <ThDiv className='w-1/12 border-y border-l border-solid border-black'>상태</ThDiv>
                <TdDiv className='w-5/12 border border-solid border-black'>
                  <SearchCheckbox
                    optionList={statusOptions}
                    checkedOptions={statusList}
                    setCheckedOptions={setStatusList}
                  />
                </TdDiv>
              </div>
              <div className='flex'>
                <ThDiv className='w-1/12 border-x border-solid border-black'>검색기간</ThDiv>
                <TdDiv className='w-11/12 border-r border-solid border-black'>날짜</TdDiv>
              </div>
              <div className='flex'>
                <ThDiv className='w-1/12 border border-solid border-black'>조건검색</ThDiv>
                <TdDiv className='w-11/12 border-y border-r border-solid border-black'>검색</TdDiv>
              </div>
            </div>

            <div className='flex gap-[10px] justify-end py-[5px]'>
              <Button>초기화</Button>
              <Button onClick={getAdminList}>검색</Button>
            </div>
          </div>
        </div>

        {loading ? (
          <SkeletonLoading type='default' length={5} />
        ) : (
          <Table
            className='border-t-2'
            rowKey='id'
            columns={columns}
            dataSource={data}
            pagination={paginationConfig}
            locale={{
              emptyText: (
                <TableEmptyDiv>
                  <p dangerouslySetInnerHTML={{ __html: "가입된 회원이 없습니다." }} />
                </TableEmptyDiv>
              ),
            }}
            onRow={(record, rowIndex) => {
              return {
                onDoubleClick: e => {
                  console.log(e.target.value);
                  console.log(record);
                  console.log(rowIndex);
                },
              };
            }}
          />
        )}
      </AdminBoard>
    </AdminPageWrap>
  );
};

const ThDiv = styled.div`
  height: 40px;
  background-color: #f1f5f9;

  text-align: center;
`;

const TdDiv = styled.div`
  height: 40px;
`;

export default ManageUserList;
