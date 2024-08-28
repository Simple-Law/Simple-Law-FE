import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Input, Select, Table } from "antd";
import UserTag from "components/tags/UserTag";
import { AccountStatusTag } from "components/tags/StatusTag";
import { AdminBoard, AdminPageWrap, TableEmptyDiv } from "components/styled/StyledComponents";
import { useCommonContext } from "contexts/CommonContext";
import { useMessageApi } from "components/messaging/MessageProvider";
import { useDispatch, useSelector } from "react-redux";
import { hideSkeletonLoading, showSkeletonLoading } from "../../../redux/actions/loadingAction";
import { SkeletonLoading } from "components/layout/LoadingSpinner";
import styled from "styled-components";
import UserNameColumn from "components/table/UserNameColumn";
import { SearchCheckbox, SearchDatePicker } from "components/input/SearchItems";
import { formatDate } from "utils/dateUtil";
import { searchUserAPI } from "apis/manageUserAPI";
import dayjs from "dayjs";

const ManageUserList = () => {
  const columns = [
    {
      width: 32,
    },
    {
      title: "이름",
      key: "name",
      render: (_, record) => <UserNameColumn mainText={record.name} subText={record.email} />,
    },
    {
      title: "회원구분",
      key: "type",
      render: (_, record) => <UserTag userType={record.type} />,
    },
    {
      title: "가입일",
      key: "createdAt",
      render: (_, record) => <span>{formatDate(record.createdAt)}</span>,
    },
    {
      title: "최근 접속일",
      key: "latestAccessAt",
      render: (_, record) => <span>{formatDate(record.latestAccessAt)}</span>,
    },
    {
      title: "상태",
      key: "status",
      render: (_, record) => (
        <div>
          <AccountStatusTag status={record.status} />
        </div>
      ),
    },
  ];

  const messageApi = useMessageApi();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.SkeletonLoading);
  const { paginationConfig } = useCommonContext();
  const pageTitle = "전체 사용자";

  //TODO: kmee js 분리
  const userOptions = [
    { label: "의뢰인", value: "MEMBER" },
    { label: "변호사", value: "LAWYER" },
  ];
  const statusOptions = [
    { label: "활성화", value: "JOIN" },
    { label: "비활성화", value: "WITHDRAW" },
  ];
  const searchOptions = [
    { label: "이름", value: "name" },
    { label: "이메일", value: "email" },
  ];
  const dateOptions = [
    { label: "가입일", value: "createdAt" },
    { label: "최근접속일", value: "latestlatestAccessAt" },
  ];
  const [typeList, setTypeList] = useState(userOptions.map(option => option.value));
  const [statusList, setStatusList] = useState(statusOptions.map(option => option.value));

  const initialSearchParams = {
    textType: searchOptions[0].value,
    dateType: dateOptions[0].value,
    name: "",
    email: "",
    typeList: typeList,
    statusList: statusList,
    joinStartAt: "",
    joinEndAt: "",
    // latestAccessStartAt: "",
    // latestAccessEndAt: "",
    pageNumber: 1,
    pageSize: 5,
  };
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  const [paramDate, setParamDate] = useState({
    startDate: dayjs().subtract(1, "month"),
    endDate: dayjs(),
  });

  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  useLayoutEffect(() => {
    getUserList();
  }, []);
  // }, [searchParams]);

  useEffect(() => {
    setSearchParams({ ...searchParams, typeList, statusList });
  }, [typeList, statusList]);

  /**
   * 회원관리 목록 조회
   */
  //TODO: kmee 기간검색, 조건검색 추가. 상태 검색 data 확인
  const getUserList = async () => {
    try {
      const text = document.getElementById("searchText");
      console.log("text : ", text.value);
      if (searchParams.textType === "name") {
        searchParams.name = text.value;
        searchParams.email = "";
      } else if (searchParams.textType === "email") {
        searchParams.email = text.value;
        searchParams.name = "";
      }

      const apiParams = {
        ...searchParams,
        typeList: searchParams.typeList.join(","),
        statusList: searchParams.statusList.join(","),
        joinStartAt: paramDate.startDate.toISOString(),
        joinEndAt: paramDate.endDate.toISOString(),
      };

      dispatch(showSkeletonLoading());
      const response = await searchUserAPI(apiParams);
      if (response.status === 200 && response.data.status === "success") {
        setData(response.data.data.payload);
      }
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
            {/* searchbox start */}
            <div className='h-[236px] p-6 bg-white rounded-xl flex-col justify-start items-end gap-8 inline-flex'>
              <div className='self-stretch h-[188px] flex-col justify-start items-end gap-3 flex'>
                <div className='self-stretch h-[132px] flex-col justify-start items-start gap-3 flex'>
                  <div className='justify-start items-start inline-flex'>
                    <SearchDiv className='w-1/2'>
                      <span>회원 구분</span>
                      <SearchCheckbox
                        optionList={userOptions}
                        checkedOptions={typeList}
                        setCheckedOptions={setTypeList}
                      />
                    </SearchDiv>
                    <SearchDiv className='w-1/2'>
                      <span>상태</span>
                      <SearchCheckbox
                        optionList={statusOptions}
                        checkedOptions={statusList}
                        setCheckedOptions={setStatusList}
                      />
                    </SearchDiv>
                  </div>

                  <SearchDiv>
                    <span>검색기간</span>
                    <Select className='w-[150px] h-[38px] mr-2' options={dateOptions} defaultValue={dateOptions[0]} />
                    <SearchDatePicker paramDate={paramDate} setParamDate={setParamDate} />
                  </SearchDiv>

                  <div className='self-stretch justify-start items-center inline-flex'>
                    <div className="w-[120px] text-black text-sm font-semibold font-['Pretendard'] leading-tight">
                      검색기간
                    </div>
                    <div className='justify-start items-center gap-2 flex'>
                      <div className='justify-start items-start gap-2 flex'>
                        <div className='pl-4 pr-1.5 py-1.5 bg-white rounded-md border border-[#d4dde6] justify-start items-center flex'>
                          <div className="w-[100px] text-[#6e7780] text-sm font-normal font-['Pretendard'] leading-tight">
                            가입일
                          </div>
                          <div className='w-6 h-6 relative' />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='self-stretch justify-between items-center inline-flex'>
                    <div className="w-[120px] text-black text-sm font-semibold font-['Pretendard'] leading-tight">
                      검색어
                    </div>
                    <div className='grow shrink basis-0 h-9 justify-start items-center gap-2 flex'>
                      <div className='justify-start items-start gap-2 flex'>
                        <div className='pl-4 pr-1.5 py-1.5 bg-white rounded-md border border-[#d4dde6] justify-start items-center flex'>
                          <div className="w-[100px] text-[#6e7780] text-sm font-normal font-['Pretendard'] leading-tight">
                            이름
                          </div>
                          <div className='w-6 h-6 relative' />
                        </div>
                      </div>
                      <div className='grow shrink basis-0 h-9 px-4 py-2 bg-white rounded-md border border-[#d4dde6] justify-start items-center flex'>
                        <div className="text-[#6e7780] text-sm font-normal font-['Pretendard'] leading-tight">
                          검색어를 입력하세요
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='justify-start items-center gap-2 inline-flex'>
                  <div className='w-[88px] px-8 py-3 bg-white rounded-lg border border-[#e3e9ee] flex-col justify-center items-center gap-1 inline-flex'>
                    <div className="text-center text-[#6e7780] text-sm font-medium font-['Pretendard'] leading-tight">
                      초기화
                    </div>
                  </div>
                  <div className='h-11 px-8 py-3 bg-[#287eff] rounded-lg justify-center items-center gap-1 flex'>
                    <div className="text-center text-white text-sm font-medium font-['Pretendard'] leading-tight">
                      검색
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* searchbox start */}
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
                <TdDiv className='w-11/12 border-r border-solid border-black'>
                  <Select
                    className='justify-center w-[150px] ml-[10px] '
                    options={dateOptions}
                    defaultValue={dateOptions[0]}
                  />
                  <SearchDatePicker paramDate={paramDate} setParamDate={setParamDate} />
                </TdDiv>
              </div>
              <div className='flex'>
                <ThDiv className='w-1/12 border border-solid border-black'>조건검색</ThDiv>
                <TdDiv className='w-11/12 border-y border-r border-solid border-black'>
                  <div className='flex gap-[10px] h-[48px]'>
                    <Select
                      id='searchType'
                      className='justify-center w-[160px] ml-[10px]'
                      options={searchOptions}
                      defaultValue={searchParams.textType}
                      onChange={value => setSearchParams({ ...searchParams, textType: value })}
                    />
                    <Input id='searchText' className='justify-center' />
                  </div>
                </TdDiv>
              </div>
            </div>

            <div className='flex justify-end gap-[10px] '>
              <Button>초기화</Button>
              <Button onClick={getUserList}>검색</Button>
            </div>
          </div>
        </div>
        {/* searchbox end */}

        {loading ? (
          <SkeletonLoading type='default' length={5} />
        ) : (
          <Table
            className='border-t-2'
            rowKey={data => data.key}
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

const SearchDiv = styled.div`
  display: flex;
  align-items: center;

  > span {
    width: 120px;
    color: black;

    font-family: Pretendard;
    font-size: 14px;
    font-weight: 600;
    line-height: 146%; /* 20.44px */
    letter-spacing: -0.28px;
  }
}
`;

const ThDiv = styled.div`
  display: flex;
  width: 120px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;

  // display: flex;
  // justify-content: center;
  // text-align: center;
  // align-items: center;

  // min-width: 100px;
  // height: 60px;
  // background-color: #f1f5f9;
`;

const TdDiv = styled.div`
  display: flex;
  align-items: center;

  height: 60px;
`;

export default ManageUserList;
