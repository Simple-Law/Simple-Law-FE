import { useEffect } from "react";
import { Button, Menu } from "antd";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setMails, setTableData, fetchMailsAction } from "../../redux/actions/mailActions";
import SvgMailAll from "components/Icons/MailAll";
import SvgMailStar from "components/Icons/MailStar";
import SvgMail from "components/Icons/Mail";
import SvgTrash from "components/Icons/Trash";
import SvgManageAdmin from "components/Icons/ManageAdmin";
import SvgManageUser from "components/Icons/ManageUser";
import SvgEvent from "components/Icons/Event";
import { commonStatusLabels, statusLabels, adminStatusLabels } from "utils/statusLabels";

const RequestSideMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, counts } = useSelector(state => state.mail);
  const user = useSelector(state => state.auth.user) || {};
  const userType = user.type || "guest";

  useEffect(() => {
    const parentElement = document.querySelector(".my-column").closest(".ant-menu-title-content");
    if (parentElement) {
      parentElement.classList.add("custom-arrow");
    }
    dispatch(fetchMailsAction());
  }, [dispatch]);

  const statusTypes = statusLabels[userType] || statusLabels["guest"];

  const handleMenuClick = statusKey => {
    let filteredMails;
    switch (statusKey) {
      case "important":
        filteredMails = data.filter(mail => mail.isImportant);
        break;
      case "trash":
        filteredMails = data.filter(mail => mail.status === "휴지통");
        break;
      case "All_request":
        filteredMails = data;
        break;
      default:
        filteredMails = data.filter(mail => mail.status === statusKey);
    }

    dispatch(setMails(filteredMails));
    dispatch(setTableData({ mails: filteredMails, statusKey }));
    navigate(`/board?status=${statusKey}`);
  };

  const menuItems = [
    {
      key: "All_request",
      label: (
        <span className='ml-2 text-stone-950'>
          {commonStatusLabels.All_request}
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{counts.total}</span>
        </span>
      ),
      icon: <SvgMailAll />,
      onTitleClick: () => handleMenuClick("All_request"),

      children: Object.keys(statusTypes).map(statusKey => ({
        key: statusKey,
        label: (
          <span>
            {statusTypes[statusKey]}
            <span
              style={{
                marginLeft: "8px",
                color: "#2E7FF8",
                fontSize: "14px",
              }}
            >
              {counts[statusKey]}
            </span>
          </span>
        ),
      })),
    },
    {
      key: "important",
      label: (
        <span className='text-stone-950'>
          {commonStatusLabels.important}
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{counts.important}</span>
        </span>
      ),
      onTitleClick: () => handleMenuClick("important"),
      icon: <SvgMailStar />,
    },
    {
      key: "endRequest", //TODO: 종료 의뢰함 보류중
      label: (
        <span className='text-stone-950'>
          {commonStatusLabels.endRequest}
          {/* <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{counts.important}</span> */}
        </span>
      ),
      icon: <SvgMail />,
      // onTitleClick: () => handleMenuClick("important"),
    },

    {
      type: "divider",
    },
    {
      key: "trash",
      label: (
        <span className='text-stone-950'>
          {commonStatusLabels.trash}
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

export const AdminSideMenu = () => {
  const user = useSelector(state => state.auth.user) || {};
  const userType = user.type;
  const statusTypes = statusLabels[userType];

  const navigate = useNavigate();

  const questMenuItems = [
    {
      key: "allRequest",
      icon: <SvgMailAll />,
      label: <Menulv2 id='allRequest'>{commonStatusLabels.All_request}</Menulv2>,
      children: Object.keys(statusTypes).map(statusKey => ({
        key: statusKey,
        label: <span>{statusTypes[statusKey]}</span>,
      })),
    },

    {
      key: "important",
      icon: <SvgMailStar />,
      label: <Menulv2>{commonStatusLabels.important}</Menulv2>,
    },
    {
      key: "endRequest",
      icon: <SvgMail />,
      label: <Menulv2>{commonStatusLabels.endRequest}</Menulv2>,
    },
  ];
  const accountMenuItems = [
    {
      key: "manage-admin",
      icon: <SvgManageAdmin />,
      label: <Menulv2 className='menulv2'>{adminStatusLabels.manageAdmin}</Menulv2>,
    },
    {
      key: "",
      label: <Menulv2 id='manageUser'>{adminStatusLabels.manageUser}</Menulv2>,
      icon: <SvgManageUser />,
      children: [
        {
          key: "manage-user",
          label: <Menulv3>{adminStatusLabels.allUser}</Menulv3>,
        },
        {
          key: "join-request",
          label: <Menulv3>{adminStatusLabels.requestSignup}</Menulv3>,
        },
      ],
    },
    {
      key: "manage-event",
      icon: <SvgEvent />,
      label: <Menulv2>{adminStatusLabels.manageEvent}</Menulv2>,
    },
  ];

  useEffect(() => {
    const questMain = document.querySelector("#questMain").closest(".ant-menu-title-content");
    const accountMain = document.querySelector("#accountMain").closest(".ant-menu-title-content");
    const allRequest = document.querySelector("#allRequest").closest(".ant-menu-title-content");
    const manageUser = document.querySelector("#manageUser").closest(".ant-menu-title-content");

    questMain.classList.add("menulv1-arrow");
    accountMain.classList.add("menulv1-arrow");
    allRequest.classList.add("menulv2-arrow");
    manageUser.classList.add("menulv2-arrow");
  }, []);

  const onClickMenu = e => {
    navigate(`/admin/${e.key}`);
  };

  return (
    <AdminMenuWrap className='w-[245px] px-4 border-e-[1px] shrink-0 '>
      <Menu
        onClick={onClickMenu}
        defaultOpenKeys={["questMain", "allRequest", "accountMain"]}
        // defaultSelectedKeys={["preparing", "manage-admin", "manage-user"]}
        mode='inline'
        className='w-full border-e-0'
        items={[
          {
            key: "questMain",
            label: <Menulv1 id='questMain'>의뢰함</Menulv1>,
            children: questMenuItems,
          },
          {
            type: "divider",
          },
          {
            key: "accountMain",
            label: <Menulv1 id='accountMain'>계정</Menulv1>,
            children: accountMenuItems,
          },
        ]}
      />
    </AdminMenuWrap>
  );
};

export default RequestSideMenu;

const Board = styled.div`
  height: calc(100vh - 64px);
  border-right: 1px solid #e3e9ee;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%), #f1f5f9;

  .ant-menu {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%), #f1f5f9;
    font-size: 14px;
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

const AdminMenuWrap = styled(Board)`
  background: #ffffff;

  .ant-menu {
    background: #ffffff;
  }
  .ant-menu-item-selected {
    background: #ffffff;
  }
  .menulv1-arrow + .ant-menu-submenu-arrow {
    left: 50px;
  }
  .menulv2-arrow + .ant-menu-submenu-arrow {
    left: 190px;
  }
`;

const Menulv1 = styled.span`
  color: #6e7780;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.26px;
`;
const Menulv2 = styled.span`
  margin-left: 2px;
  color: rgba(23, 23, 23, 1);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.28px;
`;

const Menulv3 = styled.span`
  margin-left: 5px;

  color: rgba(110, 119, 128, 1);
  font-size: 14px;
  font-weight: 500;
  e-height: 18px;
  letter-spacing: -0.28px;
`;
