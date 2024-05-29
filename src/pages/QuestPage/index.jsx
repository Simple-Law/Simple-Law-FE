import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Dropdown, Input, Menu, Table } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import StatusTag from "components/Tags";
import styled from "styled-components";
import { updateMail } from "apis/mailsApi";
import { useMailContext } from "contexts/MailContexts";
import SvgSearch from "components/Icons/Search";
import SvgArrowUp from "components/Icons/ArrowUp";
import SvgArrowDown from "components/Icons/ArrowDown";

const { Search } = Input;

const QuestPage = () => {
  const [timeColumn, setTimeColumn] = useState("sentAt");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("의뢰 요청시간");

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusKey = queryParams.get("status");

  const { state, dispatch } = useMailContext();
  // const { mails, data } = state;
  const { mails, tableData } = state; // tableData를 사용
  // const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const combinedData = [];
    mails.forEach(item => {
      combinedData.push(item);
      if (item.replies && item.replies.length > 0) {
        item.replies.forEach((reply, index) => {
          combinedData.push({
            ...reply,
            parentTitle: item.title,
            key: `${item.id}-${index}`,
          });
        });
      }
    });
    dispatch({ type: "SET_TABLE_DATA", payload: combinedData });
  }, [mails, dispatch]);

  const toggleImportant = async (id, event) => {
    event.stopPropagation();
    const newData = state.data.map(item => {
      if (item.id === id) {
        item.isImportant = !item.isImportant;
      }
      return item;
    });

    dispatch({ type: "SET_DATA", payload: newData });
    dispatch({ type: "UPDATE_COUNTS", payload: newData });

    try {
      const updatedItem = newData.find(item => item.id === id);
      await updateMail(id, { isImportant: updatedItem.isImportant });

      if (statusKey === "important" && !updatedItem.isImportant) {
        const filteredMails = newData.filter(mail => mail.isImportant);
        dispatch({ type: "SET_MAILS", payload: filteredMails });
        dispatch({ type: "SET_TABLE_DATA", payload: filteredMails }); // 추가: tableData 업데이트
      }
    } catch (error) {
      console.error("Error updating important status:", error);
    }
  };

  const handleTimeMenuClick = e => {
    setTimeColumn(e.key);
    setHeaderTitle(e.item.props.children);
    setDropdownOpen(false); // 드롭다운 닫기
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
          e.stopPropagation(); // 이벤트 버블링 중지
          toggleImportant(record.id, e); // 중요 표시 토글 함수 호출
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
      width: 150,
      key: "status",
      dataIndex: "status",
      render: status => <StatusTag status={status} />,
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
      width: 320,
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
      width: 140,
      dataIndex: timeColumn,
      key: "time",
      render: text => <span>{text}</span>,
    },
  ];

  const paginationConfig = {
    pageSize: 10, // Set the number of items per page
    position: ["bottomCenter"],
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <BoardDiv className="mt-6 mx-8 w-full">
      <div className="flex justify-between items-end mb-3">
        <h2 className=" font-bold text-[20px]">전체 의뢰함</h2>
        <PageSearch
          placeholder="Placeholder"
          onSearch={onSearch}
          enterButton={<SvgSearch width="16px" height="16px" />}
          style={{
            width: 268,
          }}
        />
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={paginationConfig}
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
