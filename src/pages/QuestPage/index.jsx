import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactComponent as Trash } from "assets/images/icons/trash.svg";
import { ReactComponent as Mail } from "assets/images/icons/mail.svg";
import { ReactComponent as MailStar } from "assets/images/icons/mailStar.svg";
import { ReactComponent as MailAll } from "assets/images/icons/mailAll.svg";
import { ReactComponent as ArrowDown } from "assets/images/icons/arrowDown.svg";
import { ReactComponent as ArrowUp } from "assets/images/icons/arrowUp.svg";
import { ReactComponent as SearchIcon } from "assets/images/icons/search.svg";
import { FaStar, FaRegStar, FaPlus } from "react-icons/fa";
import { Button, Dropdown, Input, Menu, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
import StatusTag from "components/Tags";
import styled from "styled-components";
import { fetchMails, updateMailImportant } from "components/apis/mailsApi";
const { Search } = Input;

const Board = styled.div`
  .right-side {
    height: calc(100vh - 64px);
    border-right: 1px solid #e3e9ee;
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.6) 0%,
        rgba(255, 255, 255, 0.6) 100%
      ),
      #f1f5f9;
  }
  .ant-menu {
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.6) 0%,
        rgba(255, 255, 255, 0.6) 100%
      ),
      #f1f5f9;
  }
  .ant-menu-item-divider {
    background: #e3e9ee;
    margin: 16px 0;
  }
  .ant-menu-submenu-title,
  .ant-menu-item {
    padding: 8px !important;
  }
  .ant-pagination-item-active {
    border: transparent !important;
  }
  .ant-menu-item-only-child {
    padding: 0 40px !important;
  }
  .ant-spin-container {
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
const QuestPage = () => {
  const [mails, setMails] = useState([]);
  const [data, setData] = useState([]);
  const [timeColumn, setTimeColumn] = useState("sentAt");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("의뢰 요청시간");
  const [counts, setCounts] = useState({
    total: 0,
    preparing: 0,
    pending: 0,
    completed: 0,
    refuse: 0,
    important: 0,
    trash: 0,
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await fetchMails();
      if (error) return;

      const nonTrashData = data.filter((mail) => mail.statue !== "휴지통");
      setData(data);
      setMails(nonTrashData);

      const counts = {
        total: nonTrashData.length,
        preparing: data.filter((mail) => mail.statue === "preparing").length,
        pending: data.filter((mail) => mail.statue === "pending").length,
        completed: data.filter((mail) => mail.statue === "completed").length,
        refuse: data.filter((mail) => mail.statue === "refuse").length,
        important: data.filter((mail) => mail.isImportant).length,
        trash: data.filter((mail) => mail.statue === "휴지통").length,
      };
      setCounts(counts);
    };

    fetchData();
  }, []);

  const menuItems = [
    {
      key: "All_request",
      label: (
        <span className="ml-2">
          전체 의뢰함
          <span
            style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}
          >
            {counts.total}
          </span>
        </span>
      ),
      icon: <MailAll />,
      onTitleClick: () => handleMenuClick("All_request"),
      children: [
        {
          key: "preparing",
          label: (
            <span>
              신청중
              <span
                style={{
                  marginLeft: "8px",
                  color: "#2E7FF8",
                  fontSize: "14px",
                }}
              >
                {counts.preparing}
              </span>
            </span>
          ),
        },
        {
          key: "pending",
          label: (
            <span>
              보류중
              <span
                style={{
                  marginLeft: "8px",
                  color: "#2E7FF8",
                  fontSize: "14px",
                }}
              >
                {counts.pending}
              </span>
            </span>
          ),
        },
        {
          key: "completed",
          label: (
            <span>
              신청완료
              <span
                style={{
                  marginLeft: "8px",
                  color: "#2E7FF8",
                  fontSize: "14px",
                }}
              >
                {counts.completed}
              </span>
            </span>
          ),
        },
        {
          key: "refuse",
          label: (
            <span>
              신청거절
              <span
                style={{
                  marginLeft: "8px",
                  color: "#2E7FF8",
                  fontSize: "14px",
                }}
              >
                {counts.refuse}
              </span>
            </span>
          ),
        },
      ],
    },
    {
      key: "important",
      label: (
        <span>
          중요 의뢰함
          <span
            style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}
          >
            {counts.important}
          </span>
        </span>
      ),
      onTitleClick: () => handleMenuClick("important"),
      icon: <MailStar />,
    },
    {
      key: "sub4",
      label: "종료된 의뢰함",
      icon: <Mail />,
    },

    {
      type: "divider",
    },
    {
      key: "trash",
      label: (
        <span>
          휴지통
          <span
            style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}
          >
            {counts.trash}
          </span>
        </span>
      ),
      onTitleClick: () => handleMenuClick("trash"),
      icon: <Trash />,
    },
  ];
  const handleMenuClick = (statusKey) => {
    if (statusKey === "All_request") {
      setMails(data); // 전체 데이터를 설정
      navigate(`/board?status=all`); // 쿼리스트링을 사용하여 이동
    } else if (statusKey === "important") {
      const importantMails = data.filter((mail) => mail.isImportant);
      setMails(importantMails); // 중요 메일 데이터 설정
      navigate(`/board?status=important`); // 쿼리스트링을 사용하여 이동
    } else if (statusKey === "trash") {
      const trashMails = data.filter((mail) => mail.statue === "휴지통");
      setMails(trashMails); // 휴지통 메일 데이터 설정
      navigate(`/board?status=trash`); // 쿼리스트링을 사용하여 이동
    } else {
      const filteredMails = data.filter((mail) => mail.statue === statusKey);
      setMails(filteredMails); // 필터링된 메일 데이터 상태 업데이트
      navigate(`/board?status=${statusKey}`); // 쿼리스트링을 사용하여 이동
    }
  };

  const onClick = async (e) => {
    const statusKey = e.key;
    handleMenuClick(statusKey);
  };

  const toggleImportant = async (id, event) => {
    event.stopPropagation();
    const newData = data.map((item) => {
      if (item.id === id) {
        item.isImportant = !item.isImportant;
      }
      return item;
    });

    const importantCount = newData.filter((item) => item.isImportant).length;
    setCounts({ ...counts, important: importantCount });
    setData(newData);

    try {
      const updatedItem = newData.find((item) => item.id === id);
      await updateMailImportant(id, updatedItem.isImportant);
    } catch (error) {
      console.error("Error updating important status:", error);
    }
  };

  const handleTimeMenuClick = (e) => {
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
      onCell: (record) => ({
        onClick: (e) => {
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
      key: "statue",
      dataIndex: "statue",
      render: (statue) => <StatusTag status={statue} />,
    },
    {
      title: (
        <div>
          <span style={{ width: "27px", display: "inline-block" }}>분야</span>
          <span
            style={{ fontSize: "12px", color: "#D9D9D9", margin: "0 10px" }}
          >
            |
          </span>
          <span>세부 분야</span>
        </div>
      ),
      key: "category",
      dataIndex: "category",
      width: 320,
      render: (_, record) => (
        <>
          <span style={{ width: "27px", display: "inline-block" }}>
            {record.category}
          </span>
          <span
            style={{ fontSize: "12px", color: "#D9D9D9", margin: "0 10px" }}
          >
            |
          </span>
          <span>{record.anytime}</span>
        </>
      ),
    },
    { title: "제목", dataIndex: "title", key: "title" },

    {
      title: (
        <Dropdown
          overlay={menu}
          onVisibleChange={(visible) => setDropdownOpen(visible)}
          trigger={["click"]}
        >
          <button
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
            onClick={(e) => e.preventDefault()}
          >
            {headerTitle} {dropdownOpen ? <ArrowUp /> : <ArrowDown />}
          </button>
        </Dropdown>
      ),
      width: 140,
      dataIndex: timeColumn,
      key: "time",
      render: (text) => <span>{text}</span>,
    },
  ];
  const paginationConfig = {
    pageSize: 10, // Set the number of items per page
    position: ["bottomCenter"],
  };
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <Board className="flex w-full pt-16">
      <div className="w-[245px] px-4 border-e-[1px] shrink-0 right-side">
        <Button
          type="primary"
          block
          className="my-6 flex items-center justify-center"
          onClick={() => navigate("/mail/quest")}
        >
          <FaPlus className="mr-1" />
          의뢰 요청하기
        </Button>
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={menuItems}
          className="w-full border-e-0"
        />
      </div>

      <div className="mt-6 mx-8 w-full">
        <div className="flex justify-between items-end mb-3">
          <h2 className=" font-bold text-[20px]">전체 의뢰함</h2>
          <PageSearch
            placeholder="Placeholder"
            onSearch={onSearch}
            enterButton={<SearchIcon />}
            style={{
              width: 268,
            }}
          />
        </div>
        <Table
          dataSource={mails}
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
      </div>
    </Board>
  );
};

export default QuestPage;
