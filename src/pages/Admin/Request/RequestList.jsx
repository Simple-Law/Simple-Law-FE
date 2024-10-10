import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCommonContext } from "contexts/CommonContext";
import { AdminBoard, AdminPageWrap, TableEmptyDiv } from "components/styled/StyledComponents";
import SvgSearch from "components/Icons/Search";
import { PageSearch } from "pages/Request/MyRequestList";
import { useSelector } from "react-redux";
import { Table } from "antd";
import { SkeletonLoading } from "components/layout/LoadingSpinner";
import { statusLabels } from "utils/statusLabels";

const ManageAdminList = () => {
  const { paginationConfig } = useCommonContext();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [pageTitle, setPageTitle] = useState("");

  const loading = useSelector(state => state.loading.SkeletonLoading);

  const columns = [
    {
      width: 32,
    },
    {
      title: "상태",
      key: "a",
      render: <span></span>,
    },
    {
      title: "분야",
      key: "b",
      render: <span></span>,
    },
    {
      title: "세부분야",
      key: "c",
      render: <span></span>,
    },
    {
      title: "제목",
      key: "d",
      render: <span></span>,
    },
    {
      title: "의뢰 요청시간",
      key: "e",
      render: <span></span>,
    },
    {
      title: "제한시간",
      key: "f",
      render: <span></span>,
    },
  ];

  useLayoutEffect(() => {
    const pageTitles = statusLabels.ADMIN;
    const statusArray = params.get("displayStatus") ? params.get("displayStatus").split(",") : [];

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
              // dataSource={data}
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
