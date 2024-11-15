import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Dropdown, Input, Menu, Table, Skeleton } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { StatusTag } from "components/tags/StatusTag";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import SvgSearch from "components/Icons/Search";
import SvgArrowUp from "components/Icons/ArrowUp";
import SvgArrowDown from "components/Icons/ArrowDown";
import { toggleImportant } from "../../redux/actions/mailActions";
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
  const { paginationConfig } = useCommonContext();

  const dispatch = useDispatch();
  const { mails } = useSelector(state => state.mail);
  const [mailLists, setMailLists] = useState(mails);

  const user = useSelector(state => state.auth.user) || {};
  const userType = user.type || "guest";
  const mailLoading = useSelector(state => state.loading.mailLoading);

  useEffect(() => {
    if (mails && mails.length > 0) {
      updateMailLists();
    }
  }, [location, mails, userType]);

  // 메일 목록 업데이트 함수
  const updateMailLists = () => {
    const params = new URLSearchParams(location.search);
    const statusKey = params.get("status") || "All_request";
    const filteredMails = filterMails(mails, statusKey);
    setMailLists(filteredMails);
    updateHeaderTitle(statusKey);
  };

  // 헤더 타이틀 업데이트 함수
  const updateHeaderTitle = statusKey => {
    const userSpecificStatus = statusLabels[userType] || {};
    const title = userSpecificStatus[statusKey]
      ? `전체 의뢰함 (${userSpecificStatus[statusKey]})`
      : commonStatusLabels[statusKey] || "전체 의뢰함";
    setHeaderTitle(title);
  };

  // 중요 표시 토글 함수
  const handleToggleImportant = (id, event) => {
    event.stopPropagation();
    const updatedMailLists = toggleMailImportance(id);
    setMailLists(updatedMailLists);

    dispatch(toggleImportant(id)).catch(() => setMailLists(mailLists)); // 실패 시 롤백
  };

  // 메일 목록에서 중요 표시 토글
  const toggleMailImportance = id =>
    mailLists.map(mail => (mail.caseKey === id ? { ...mail, isImportant: !mail.isImportant } : mail));

  //TODO: 메일 목록에서 읽음 상태 토글 : isRead 상태를 서버에서 받아오는 것으로 변경 필요
  const toggleMailReadStatus = id => mailLists.map(mail => (mail.caseKey === id ? { ...mail, isRead: true } : mail));

  // 시간 메뉴 클릭 핸들러
  const handleTimeMenuClick = e => {
    const selectedItem = menuItems.find(item => item.key === e.key);
    setTimeColumn(e.key);
    setTimeHeaderTitle(selectedItem.label);
    setDropdownOpen(false);
  };

  const menuItems = [
    { key: "requestAtDesc", label: "의뢰 요청시간" },
    { key: "notifiedAtDesc", label: "알림시간" },
  ];

  const menu = <Menu items={menuItems} onClick={handleTimeMenuClick} />;

  const columns = [
    {
      key: "important",
      dataIndex: "important",
      width: 48,
      onCell: record => ({
        onClick: e => handleToggleImportant(record.caseKey, e),
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
          <span style={{ display: "inline-block" }}>분야</span>
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
          <span>{record.category}</span>
          <span style={{ fontSize: "12px", color: "#D9D9D9", margin: "0 10px" }}>|</span>
          <span style={{ display: "inline-block" }}>{record.subCategory}</span>
        </>
      ),
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      className: "title-column",
      render: (_, record) => (
        // TODO: 댓글 수 표시 (임시)
        <div style={{ color: record.isRead ? "#ccc" : "#000" }}>
          {record.title} {record.commentCount > 0 && <span>({record.commentCount})</span>}
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
    const statusKey = mails.status || "All_request";
    const commonLabels = {
      important: "중요 의뢰함에 의뢰가 없습니다.",
      trash: "휴지통에 의뢰가 없습니다.",
    };
    return (
      commonLabels[statusKey] ||
      statusLabels[userType]?.[statusKey] ||
      "의뢰가 없습니다.<br>의뢰 요청 완료 시 요청 진행 중 의뢰함에 표시됩니다."
    );
  };

  if (mailLoading) {
    return (
      <div>
        {Array.from({ length: 10 }).map((_, index) => (
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
        <h2 className='font-bold text-[20px]'>{headerTitle}</h2>
        <PageSearch
          placeholder='Placeholder'
          onSearch={onSearch}
          enterButton={<SvgSearch width='16px' height='16px' />}
          style={{ width: 268 }}
        />
      </div>
      <Table
        dataSource={mailLists}
        columns={columns}
        pagination={paginationConfig}
        locale={{
          emptyText: (
            <CustomEmpty>
              <p dangerouslySetInnerHTML={{ __html: getEmptyText() }} />
            </CustomEmpty>
          ),
        }}
        style={{ cursor: "pointer" }}
        onRow={record => ({
          onClick: () => {
            navigate(`/detail/${record.caseKey}`);
            setMailLists(toggleMailReadStatus(record.caseKey));
          },
        })}
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

export const PageSearch = styled(Search)`
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
  &.ant-input-search .ant-input-group-addon {
    background: none;
    border: none;
  }
  .ant-input-wrapper {
    background: #ffffff;
    border-radius: 4px;
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
