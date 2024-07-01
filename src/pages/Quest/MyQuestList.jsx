import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Dropdown, Input, Menu, Table } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import StatusTag from "components/tags/StatusTag";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import SvgSearch from "components/Icons/Search";
import SvgArrowUp from "components/Icons/ArrowUp";
import SvgArrowDown from "components/Icons/ArrowDown";
import { setTableData, fetchMailsAction, toggleImportant } from "../../redux/actions/mailActions";

const { Search } = Input;

const QuestPage = () => {
  const [timeColumn, setTimeColumn] = useState("sentAt");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("의뢰 요청시간");
  const [pageTitle, setPageTitle] = useState("전체 의뢰함");

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusKey = queryParams.get("status");

  const dispatch = useDispatch();

  const { data, tableData } = useSelector(state => state.mail);

  useEffect(() => {
    dispatch(fetchMailsAction());
  }, [dispatch]);

  useEffect(() => {
    let filteredMails = data;
    if (statusKey === "important") {
      filteredMails = data.filter(mail => mail.isImportant);
    } else if (statusKey === "trash") {
      filteredMails = data.filter(mail => mail.status === "휴지통");
    } else if (statusKey !== "All_request") {
      filteredMails = data.filter(mail => mail.status === statusKey);
    }
    dispatch(setTableData(filteredMails));

    const titles = {
      All_request: "전체 의뢰함",
      important: "전체 의뢰함(중요 의뢰함)",
      preparing: "전체 의뢰함(컨택 요청 중)",
      pending: "전체 의뢰함(해결 진행 중)",
      completed: "전체 의뢰함(해결 완료)",
      refuse: "신청거절",
      trash: "휴지통",
    };
    setPageTitle(titles[statusKey] || "전체 의뢰함");
  }, [statusKey, data, dispatch]);

  const handleTimeMenuClick = e => {
    setTimeColumn(e.key);
    setHeaderTitle(e.item.props.children);
    setDropdownOpen(false);
  };

  const handleToggleImportant = (id, event) => {
    event.stopPropagation();
    dispatch(toggleImportant(id));
  };
  const menu = (
    <Menu
      items={[
        { key: "sentAt", label: "의뢰 요청시간" },
        { key: "time", label: "의뢰 가능시간" },
      ]}
      onClick={handleTimeMenuClick}
    />
  );

  const columns = [
    {
      key: "important",
      dataIndex: "important",
      width: 48,
      onCell: record => ({
        onClick: e => {
          handleToggleImportant(record.id, e);
          // e.stopPropagation();
          // dispatch(toggleImportant(record.id));
        },
      }),
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
      render: status => <StatusTag status={status} />,
      width: 150, // 상태 컬럼 고정 너비
      className: "status-column",
    },
    {
      title: (
        <div>
          <span style={{ width: "27px", display: "inline-block" }}>분야</span>
          <span style={{ fontSize: "12px", color: "#D9D9D9", margin: "0 10px" }}>|</span>
          <span>세부 분야</span>
        </div>
      ),
      key: "category",
      dataIndex: "category",
      width: 260, // 분야|세부 분야 컬럼 고정 너비
      className: "category-column",
      render: (_, record) => (
        <>
          <span style={{ width: "27px", display: "inline-block" }}>{record.category}</span>
          <span style={{ fontSize: "12px", color: "#D9D9D9", margin: "0 10px" }}>|</span>
          <span>{record.anytime}</span>
        </>
      ),
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      className: "title-column",
      // '제목' 컬럼은 flex로 남은 공간을 채웁니다.
      render: (_, record) =>
        record.parentTitle ? (
          <div>
            {record.parentTitle}
            <div style={{ marginLeft: 20 }}>
              <span style={{ color: "#aaa" }}>ㄴ</span> [재질문] {record.title}
            </div>
          </div>
        ) : (
          record.title
        ),
    },
    {
      title: (
        <Dropdown overlay={menu} onVisibleChange={visible => setDropdownOpen(visible)} trigger={["click"]}>
          <button
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
            onClick={e => e.preventDefault()}
          >
            {headerTitle} {dropdownOpen ? <SvgArrowUp /> : <SvgArrowDown />}
          </button>
        </Dropdown>
      ),
      key: "time",
      dataIndex: timeColumn,
      render: text => <span>{text}</span>,
      width: 150, // 의뢰 요청시간 컬럼 고정 너비
      className: "time-column",
    },
  ];

  const paginationConfig = {
    pageSize: 10, // Set the number of items per page
    position: ["bottomCenter"],
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const getEmptyText = () => {
    const emptyTexts = {
      All_request: "전체 의뢰함에 의뢰가 없습니다.",
      important: "중요 의뢰함에 의뢰가 없습니다.",
      preparing: "컨택 요청 중 의뢰가 없습니다.<br>의뢰 요청 완료 시 요청 진행 중 의뢰함에 표시됩니다.",
      pending: "해결 진행 중 의뢰가 없습니다.",
      completed: "해결 완료된 의뢰가 없습니다.",
      refuse: "신청거절된 의뢰가 없습니다.",
      trash: "휴지통에 의뢰가 없습니다.",
    };
    return emptyTexts[statusKey] || "의뢰가 없습니다.<br>의뢰 요청 완료 시 요청 진행 중 의뢰함에 표시됩니다.";
  };

  return (
    <BoardDiv className='mt-6 mx-8 grow overflow-hidden'>
      <div className='flex justify-between items-end mb-3'>
        <h2 className=' font-bold text-[20px]'>{pageTitle}</h2>
        <PageSearch
          placeholder='Placeholder'
          onSearch={onSearch}
          enterButton={<SvgSearch width='16px' height='16px' />}
          style={{
            width: 268,
          }}
        />
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={paginationConfig}
        locale={{
          emptyText: (
            <CustomEmpty>
              <p dangerouslySetInnerHTML={{ __html: getEmptyText() }} />
            </CustomEmpty>
          ),
        }}
        style={{
          cursor: "pointer",
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => navigate(`/detail/${record.key}`),
          };
        }}
      />
    </BoardDiv>
  );
};

export default QuestPage;

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
    max-width: 120px;
    flex-basis: 120px;
  }
  .title-column {
    flex: 1 1 auto;
    min-width: 0;
  }
  .time-column {
    max-width: 150px;
    flex-basis: 150px;
  }
`;

const PageSearch = styled(Search)`
  width: 268px;
  & .ant-input {
    height: 40px;
    border-radius: 4px 0 0 4px;
    &:hover {
      border-color: rgb(228, 233, 241);
    }
    &:focus {
      border-color: rgb(228, 233, 241);
    }
  }
  &:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  }
  & .ant-btn-primary {
    height: 40px;
    border-radius: 0 4px 4px 0;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(228, 233, 241);
    border-left: none;
    background: #fff;
    &:hover {
      background: #fff !important;
    }
    & svg {
      width: 16px;
      height: 16px;
    }
  }
  &.ant-input-search {
    .ant-input-group-addon {
      background: none;
      border: none;
    }
    .ant-input-wrapper {
      background: #ffffff;
      border: 1px solid rgb(228, 233, 241);
      border-radius: 4px;
    }
  }
`;

const CustomEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  height: 100px;
`;
