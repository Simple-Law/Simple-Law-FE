import React, { useEffect } from "react";
import { Button, Menu } from "antd";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import SvgMailAll from "components/Icons/MailAll";
import SvgMailStar from "components/Icons/MailStar";
import SvgMail from "components/Icons/Mail";
import SvgTrash from "components/Icons/Trash";
import { setMails, setTableData } from "../../redux/actions/mailActions";

const RightSideMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, counts } = useSelector(state => state.mail);
  //TODO: kmee - 사용자 권한에 따라 메뉴 다르게 보이게 처리

  useEffect(() => {
    const parentElement = document.querySelector(".my-column").closest(".ant-menu-title-content");
    if (parentElement) {
      parentElement.classList.add("custom-arrow");
    }
  }, []);

  const handleMenuClick = statusKey => {
    let filteredMails = data;
    if (statusKey === "important") {
      filteredMails = data.filter(mail => mail.isImportant);
    } else if (statusKey === "trash") {
      filteredMails = data.filter(mail => mail.status === "휴지통");
    } else if (statusKey !== "All_request") {
      filteredMails = data.filter(mail => mail.status === statusKey);
    }
    dispatch(setMails(filteredMails)); // dispatch the action
    dispatch(setTableData(filteredMails)); // 추가: tableData 업데이트
    navigate(`/board?status=${statusKey}`);
  };

  const menuItems = [
    {
      key: "All_request",
      label: (
        <span className='ml-2 text-stone-950'>
          전체 의뢰함
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{counts.total}</span>
        </span>
      ),
      icon: <SvgMailAll />,
      onTitleClick: () => handleMenuClick("All_request"),
      children: [
        {
          key: "preparing",
          label: (
            <span>
              컨택 요청 중
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
              해결 진행 중
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
              해결 완료
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
        <span className='text-stone-950'>
          중요 의뢰함
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{counts.important}</span>
        </span>
      ),
      onTitleClick: () => handleMenuClick("important"),
      icon: <SvgMailStar />,
    },
    {
      key: "sub4",
      label: <span className='text-stone-950'>종료된 의뢰함</span>,
      icon: <SvgMail />,
    },

    {
      type: "divider",
    },
    {
      key: "trash",
      label: (
        <span className='text-stone-950'>
          휴지통
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{counts.trash}</span>
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
    <Board className='w-[245px] px-4 border-e-[1px] shrink-0 '>
      <Button
        type='primary'
        block
        className='my-6 flex items-center justify-center'
        onClick={() => navigate("/mail/quest")}
      >
        <FaPlus className='mr-1' />
        의뢰 요청하기
      </Button>
      <Menu
        onClick={onClick}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["main"]}
        mode='inline'
        className='w-full border-e-0'
        items={[
          {
            key: "main",
            label: (
              <span style={{ fontSize: "12px", fontWeight: "600" }} className='my-column'>
                내 의뢰함
              </span>
            ),
            children: menuItems,
          },
        ]}
      />
    </Board>
  );
};

export default RightSideMenu;

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
  .custom-arrow + .ant-menu-submenu-arrow {
    left: 65px;
  }
`;
