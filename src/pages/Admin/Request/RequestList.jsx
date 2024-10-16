import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCommonContext } from "contexts/CommonContext";
import { AdminBoard, AdminPageWrap, TableEmptyDiv } from "components/styled/StyledComponents";
import SvgSearch from "components/Icons/Search";
import { PageSearch } from "pages/Request/MyRequestList";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import { statusLabels } from "utils/statusLabels";
import { FaRegStar, FaStar } from "react-icons/fa";
import { StatusTag } from "components/tags/StatusTag";
import { getRequestList } from "apis/adminRequestAPI";
import { useMessageApi } from "components/messaging/MessageProvider";
import { hideSkeletonLoading, showSkeletonLoading } from "../../../redux/actions/loadingAction";
import { SkeletonLoading } from "components/layout/LoadingSpinner";

const ManageAdminList = () => {
  const columns = [
    {
      key: "isImportant",
      dataIndex: "isImportant",
      width: 48,
      // onCell: record => ({
      //   onClick: e => handleToggleImportant(record.caseKey, e),
      // }),
      render: (_, record) => (
        <div
          style={{
            fontSize: "18px",
            display: "flex",
            justifyContent: "center",
            color: record.isImportant ? "gold" : "#CDD8E2",
          }}
        >
          {record.isImportant ? <FaStar /> : <FaRegStar />}
        </div>
      ),
    },
    {
      title: "상태",
      key: "status",
      dataIndex: "status",
      render: status => <StatusTag status={status} userType={userType} />,
      width: 150,
      className: "status-column",
    },
    {
      title: "분야",
      key: "mainCaseCategoryName",
      render: <span></span>,
    },
    {
      title: "세부분야",
      key: "subCaseCategoryName",
      render: <span></span>,
    },
    {
      title: "제목",
      key: "title",
      render: <span></span>,
    },
    {
      title: "의뢰 요청시간",
      key: "requestedAt",
      render: <span></span>,
    },
    {
      title: "제한시간",
      key: "notifiedAt",
      render: <span></span>,
    },
  ];

  const user = useSelector(state => state.auth.user) || {};
  const userType = user.type;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const statusArray = params.get("displayStatus") ? params.get("displayStatus").split(",") : [];

  const [pageTitle, setPageTitle] = useState("");
  const { paginationConfig } = useCommonContext();

  const initialSearchParams = {
    keyword: "",
    startRequestedAt: "",
    endRequestedAt: "",
    displayStatus: statusArray,
    mainCategoryKey: "",
    subCategoryKey: "",
    pageNumber: 1,
    pageSize: paginationConfig.pageSize,
  };
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const [data, setData] = useState([]);

  const messageApi = useMessageApi();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.SkeletonLoading);

  useLayoutEffect(() => {
    const pageTitles = statusLabels.ADMIN;

    // 페이지 타이틀 설정
    if (statusArray.length > 0) {
      const matchedPage = Object.values(pageTitles).find(page => page.value.some(value => statusArray.includes(value)));
      if (matchedPage) {
        setPageTitle(matchedPage.label);
      }
    } else {
      setPageTitle("전체 의뢰함");
    }
  }, [location]);

  useEffect(() => {
    selectRequestList();
  }, []);

  /**
   * 관리자 의뢰함 목록 조회
   */
  const selectRequestList = async () => {
    try {
      const apiParams = {
        ...searchParams,
        displayStatus: searchParams.displayStatus.join(","),
      };

      dispatch(showSkeletonLoading());
      const response = await getRequestList(apiParams);
      if (response.status === 200 && response.data.status === "success") {
        setData(response.data.data.payload);
      }
    } catch (err) {
      messageApi.error(err?.response?.data?.message);
    } finally {
      dispatch(hideSkeletonLoading());
    }
  };

  return (
    <AdminPageWrap>
      <AdminBoard>
        <div>
          <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
          <PageSearch
            placeholder='Placeholder'
            // onSearch={onSearch}
            enterButton={<SvgSearch width='16px' height='16px' />}
            style={{
              width: 268,
            }}
          />

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
                    <p dangerouslySetInnerHTML={{ __html: "의뢰함이 비어있습니다" }} />
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
        </div>
      </AdminBoard>
    </AdminPageWrap>
  );
};

export default ManageAdminList;
