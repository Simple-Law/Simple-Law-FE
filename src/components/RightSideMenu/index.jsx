import React from "react";
import { Button, Menu } from "antd";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Trash } from "assets/images/icons/trash.svg";
import { ReactComponent as Mail } from "assets/images/icons/mail.svg";
import { ReactComponent as MailStar } from "assets/images/icons/mailStar.svg";
import { ReactComponent as MailAll } from "assets/images/icons/mailAll.svg";
import styled from "styled-components";
const Board = styled.div`
  height: calc(100vh - 64px);
  border-right: 1px solid #e3e9ee;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%), #f1f5f9;

  .ant-menu {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%), #f1f5f9;
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
const RightSideMenu = ({ data, onMenuClick, counts }) => {
  const navigate = useNavigate();

  const handleMenuClick = statusKey => {
    let filteredMails = data;
    if (statusKey === "important") {
      filteredMails = data.filter(mail => mail.isImportant);
    } else if (statusKey === "trash") {
      filteredMails = data.filter(mail => mail.statue === "휴지통");
    } else if (statusKey !== "All_request") {
      filteredMails = data.filter(mail => mail.statue === statusKey);
    }

    onMenuClick(filteredMails); // 부모 컴포넌트에 필터링된 데이터를 전달
    navigate(`/board?status=${statusKey}`);
  };

  const menuItems = [
    {
      key: "All_request",
      label: (
        <span className="ml-2">
          전체 의뢰함
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{counts.total}</span>
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
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{counts.important}</span>
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
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{counts.trash}</span>
        </span>
      ),
      onTitleClick: () => handleMenuClick("trash"),
      icon: <Trash />,
    },
  ];

  const onClick = e => {
    const statusKey = e.key;
    handleMenuClick(statusKey);
  };

  return (
    <Board className="w-[245px] px-4 border-e-[1px] shrink-0 ">
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
    </Board>
  );
};

export default RightSideMenu;
