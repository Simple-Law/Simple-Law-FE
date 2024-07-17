import { Button, Table } from "antd";
import { SkeletonLoading } from "components/layout/LoadingSpinner";
import { useMessageApi } from "components/messaging/MessageProvider";
import { AdminBoard, AdminPageWrap, TableEmptyDiv } from "components/styled/StyledComponents";
import UserNameColumn from "components/table/UserNameColumn";
import { LoginStatusTag } from "components/tags/StatusTag";
import { useCommonContext } from "contexts/CommonContext";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideSkeletonLoading, showSkeletonLoading } from "../../../redux/actions/loadingAction";
import { useState } from "react";

const JoinRequestList = () => {
  const mockData = [
    {
      id: "law123",
      name: "김변호",
      lawFirm: "법무법인 ㅇㅇㅇㅇ",
      requestDate: "2024.06.16",
      licenseDate: "2014.06.16",
      IdentityFile: null,
    },
    {
      id: "law222",
      name: "김법무",
      lawFirm: "법무법인 ㅇㅇㅇㅇ",
      requestDate: "2024.06.16",
      licenseDate: "2014.06.16",
      IdentityFile: null,
    },
  ];

  const columns = [
    {
      width: 48,
    },
    {
      title: "이름",
      key: "name",
      dataIndex: "name",
      render: (_, record) => <UserNameColumn userName={record.name} userId={record.id} />,
    },
    {
      title: "소속",
      key: "lawFirm",
      dataIndex: "lawFirm",
    },
    {
      title: "신청일",
      key: "requestDate",
      dataIndex: "requestDate",
    },
    {
      title: "자격 획득 년도",
      key: "licenseDate",
      dataIndex: "licenseDate",
    },
    {
      title: "변호사 신분증",
      key: "IdentityFile",
      dataIndex: "IdentityFile",
    },
    {
      title: "가입승인",
      key: "UserId",
      render: (_, record) => (
        <div className='flex gap-[6px]'>
          <Button
            className='w-[53px]'
            size='small'
            onClick={() => {
              // setSelectedUser(record);
              // setIsConfirmOpen(true);
            }}
          >
            거절
          </Button>
          <Button
            className='w-[53px]'
            size='small'
            type='primary'
            onClick={() => {
              // setSelectedUser(record);
              // setIsConfirmOpen(true);
            }}
          >
            승인
          </Button>
        </div>
      ),
    },
  ];

  const messageApi = useMessageApi();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.SkeletonLoading);
  const { paginationConfig } = useCommonContext();
  const initialSearchParams = { pageNumber: 1, pageSize: paginationConfig.pageSize };

  const pageTitle = "회원가입 요청";
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  const [selectedUser, setSelectedUser] = useState({});

  useLayoutEffect(() => {
    getUserList();
  }, [searchParams]);

  const getUserList = async () => {
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
        <div className='flex justify-between items-end mb-3'>
          <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
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
                  <p dangerouslySetInnerHTML={{ __html: "가입대기 회원이 없습니다." }} />
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

export default JoinRequestList;
