import React from "react";
import { Button, Menu } from "antd";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMailContext } from "contexts/MailContexts"; // import the context
import SvgMailAll from "components/Icons/MailAll";
import SvgMailStar from "components/Icons/MailStar";
import SvgMail from "components/Icons/Mail";
import SvgTrash from "components/Icons/Trash";

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
`;

const RightSideMenu = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useMailContext(); // use context

  const handleMenuClick = statusKey => {
    let filteredMails = state.data;
    if (statusKey === "important") {
      filteredMails = state.data.filter(mail => mail.isImportant);
    } else if (statusKey === "trash") {
      filteredMails = state.data.filter(mail => mail.statue === "휴지통");
    } else if (statusKey !== "All_request") {
      filteredMails = state.data.filter(mail => mail.statue === statusKey);
    }

    dispatch({ type: "SET_MAILS", payload: filteredMails }); // dispatch the action
    navigate(`/board?status=${statusKey}`);
  };

  const menuItems = [
    {
      key: "All_request",
      label: (
        <span className="ml-2">
          전체 의뢰함
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{state.counts.total}</span>
        </span>
      ),
      icon: <SvgMailAll />,
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
                {state.counts.preparing}
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
                {state.counts.pending}
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
                {state.counts.completed}
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
                {state.counts.refuse}
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
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{state.counts.important}</span>
        </span>
      ),
      onTitleClick: () => handleMenuClick("important"),
      icon: <SvgMailStar />,
    },
    {
      key: "sub4",
      label: "종료된 의뢰함",
      icon: <SvgMail />,
    },

    {
      type: "divider",
    },
    {
      key: "trash",
      label: (
        <span>
          휴지통
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{state.counts.trash}</span>
        </span>
      ),
      onTitleClick: () => handleMenuClick("trash"),
      icon: <SvgTrash />,
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
        defaultOpenKeys={["main"]}
        mode="inline"
        // items={menuItems}
        className="w-full border-e-0"
        items={[
          {
            key: "main",
            label: "내 의뢰함",
            children: menuItems,
          },
        ]}
      />
    </Board>
  );
};

export default RightSideMenu;
