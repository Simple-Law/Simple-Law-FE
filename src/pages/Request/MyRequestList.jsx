import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Dropdown, Input, Menu, Table, Skeleton } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import StatusTag from "components/tags/StatusTag";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import SvgSearch from "components/Icons/Search";
import SvgArrowUp from "components/Icons/ArrowUp";
import SvgArrowDown from "components/Icons/ArrowDown";
import { toggleImportant, setMails, setTableData, fetchMailsAction } from "../../redux/actions/mailActions";
import { commonStatusLabels, statusLabels } from "utils/statusLabels";
import { useCommonContext } from "contexts/CommonContext";
import { filterMails } from "utils/mailUtils";

const { Search } = Input;

const QuestPage = () => {
  const [timeColumn, setTimeColumn] = useState("sentAt");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("");
  const [timeHeaderTitle, setTimeHeaderTitle] = useState("의뢰 요청시간");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { paginationConfig } = useCommonContext();

  const { data, tableData } = useSelector(state => state.mail);
  const user = useSelector(state => state.auth.user) || {};
  const userType = user.type || "guest";
  const mailLoading = useSelector(state => state.loading.mailLoading);

  useEffect(() => {
    dispatch(fetchMailsAction());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusKey = params.get("status") || "All_request";
    const filteredMails = filterMails(data, statusKey);
    dispatch(setMails(filteredMails));
    dispatch(setTableData({ mails: filteredMails, statusKey }));

    const userSpecificStatus = statusLabels[userType] || {};
    if (userSpecificStatus[statusKey]) {
      setHeaderTitle(`전체 의뢰함 (${userSpecificStatus[statusKey]})`);
    } else {
      setHeaderTitle(commonStatusLabels[statusKey] || "전체 의뢰함");
    }
  }, [location, data, dispatch, userType]);

  const handleTimeMenuClick = e => {
    const selectedItem = menuItems.find(item => item.key === e.key);
    setTimeColumn(e.key);
    setTimeHeaderTitle(selectedItem.label);
    setDropdownOpen(false);
  };

  const handleToggleImportant = (id, event) => {
    event.stopPropagation();
    dispatch(toggleImportant(id));
  };

  const menuItems = [
    { key: "sentAt", label: "의뢰 요청시간" },
    { key: "time", label: "의뢰 가능시간" },
  ];

  const menu = <Menu items={menuItems} onClick={handleTimeMenuClick} />;

  const columns = [
    {
      key: "important",
      dataIndex: "important",
      width: 48,
      onCell: record => ({
        onClick: e => {
          handleToggleImportant(record.id, e);
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
      render: status => <StatusTag status={status} userType={userType} />,
      width: 150,
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
      width: 260,
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
      render: (_, record) => (
        <div>
          {/* {record.parentTitle ? (
            <div>
              {record.parentTitle}
              <div style={{ marginLeft: 20 }}>
                <span style={{ color: "#aaa" }}>ㄴ</span> [재질문] {record.title}
              </div>
            </div>
          ) : (
            record.title
          )} */}
          {record.replies && record.replies.length > 0 && (
            <div style={{ color: "#1890ff", marginTop: 5 }}>(답변 {record.replies.length})</div>
          )}
        </div>
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
            {timeHeaderTitle} {dropdownOpen ? <SvgArrowUp /> : <SvgArrowDown />}
          </button>
        </Dropdown>
      ),
      key: "time",
      dataIndex: timeColumn,
      render: text => <span>{text}</span>,
      width: 150,
      className: "time-column",
    },
  ];

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const getEmptyText = () => {
    const defaultText = "의뢰가 없습니다.<br>의뢰 요청 완료 시 요청 진행 중 의뢰함에 표시됩니다.";
    const statusKey = tableData.statusKey || "All_request";
    const commonLabels = {
      important: "중요 의뢰함에 의뢰가 없습니다.",
      trash: "휴지통에 의뢰가 없습니다.",
    };
    if (commonLabels[statusKey]) {
      return commonLabels[statusKey];
    }
    if (statusLabels[userType] && statusLabels[userType][statusKey]) {
      return `${statusLabels[userType][statusKey]} 의뢰가 없습니다.<br>의뢰 요청 완료 시 요청 진행 중 의뢰함에 표시됩니다.`;
    }
    return defaultText;
  };

  if (mailLoading) {
    return (
      <div>
        {[...Array(10)].map((_, index) => (
          <div key={index} className='mb-2'>
            <Skeleton active />
          </div>
        ))}
      </div>
    );
  }

  return (
    <BoardDiv className='mt-6 mx-8 grow overflow-hidden'>
      <div className='flex justify-between items-end mb-3'>
        <h2 className=' font-bold text-[20px]'>{headerTitle}</h2>
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
        dataSource={Array.isArray(tableData.mails) ? tableData.mails : []}
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
