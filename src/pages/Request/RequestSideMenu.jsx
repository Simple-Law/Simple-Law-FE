import { useEffect } from "react";
import { Button, Menu } from "antd";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchMailsAction } from "../../redux/actions/mailActions";
import SvgMailAll from "components/Icons/MailAll";
import SvgMailStar from "components/Icons/MailStar";
import SvgMail from "components/Icons/Mail";
import SvgTrash from "components/Icons/Trash";
import SvgManageAdmin from "components/Icons/ManageAdmin";
import SvgManageUser from "components/Icons/ManageUser";
import SvgEvent from "components/Icons/Event";
import { commonStatusLabels, statusLabels, adminMenuLabels } from "utils/statusLabels";
import { useState } from "react";
import { kebabCase } from "lodash";

const RequestSideMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { counts } = useSelector(state => state.mail);

  const user = useSelector(state => state.auth.user) || {};
  const userType = user.type || "guest";
  const [openKeys, setOpenKeys] = useState(["main"]);

  useEffect(() => {
    const parentElement = document.querySelector(".my-column").closest(".ant-menu-title-content");
    if (parentElement) {
      parentElement.classList.add("custom-arrow");
    }

    dispatch(fetchMailsAction(userType));
  }, [dispatch, userType]);

  useEffect(() => {
    const arrowElement = document.querySelector(".ant-menu-sub .ant-menu-submenu-arrow");

    const handleArrowClick = e => {
      e.stopPropagation();
      setOpenKeys(prevKeys =>
        prevKeys.includes("All_request") ? prevKeys.filter(key => key !== "All_request") : [...prevKeys, "All_request"],
      );
    };

    if (arrowElement) {
      arrowElement.addEventListener("click", handleArrowClick);
    }

    return () => {
      if (arrowElement) {
        arrowElement.removeEventListener("click", handleArrowClick);
      }
    };
  }, []);

  const statusTypes = statusLabels[userType] || statusLabels["guest"];

  const handleMenuClick = statusKey => {
    navigate(`/board?status=${statusKey}`);
  };

  const handleSubMenuOpenChange = keys => {
    if (keys.includes("All_request")) {
      setOpenKeys(["main"]);
    } else {
      setOpenKeys(keys);
    }
  };
  const menuItems = [
    {
      key: "All_request",
      label: (
        <span className='ml-2 text-stone-950'>
          {commonStatusLabels.All_request}
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}> {counts.TOTAL}</span>
        </span>
      ),
      icon: <SvgMailAll />,
      onTitleClick: e => {
        if (e && e.domEvent) {
          e.domEvent.stopPropagation();
        }
        setOpenKeys([]);
        handleMenuClick("All_request");
      },

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
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}>{counts.IMPORTANT}</span>
        </span>
      ),
      onTitleClick: () => handleMenuClick("important"),
      icon: <SvgMailStar />,
    },
    {
      key: "DONEE", //TODO: 종료 의뢰함 보류중
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
          <span style={{ marginLeft: "8px", color: "#2E7FF8", fontSize: "14px" }}></span>
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
      {userType !== "LAWYER" && (
        <Button
          type='primary'
          block
          className='my-6 flex items-center justify-center'
          onClick={() => navigate("/mail/quest")}
        >
          <FaPlus className='mr-1' />
          의뢰 요청하기
        </Button>
      )}
      <Menu
        onClick={onClick}
        openKeys={openKeys}
        onOpenChange={handleSubMenuOpenChange}
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
  const requestMenus = adminMenuLabels.request;
  const accountMenus = adminMenuLabels.account;

  const navigate = useNavigate();

  useEffect(() => {
    const questMain = document.querySelector("#questMain").closest(".ant-menu-title-content");
    const accountMain = document.querySelector("#accountMain").closest(".ant-menu-title-content");
    const allRequest = document.querySelector("#allRequest").closest(".ant-menu-title-content");
    const manageUser = document.querySelector("#manageUser").closest(".ant-menu-title-content");

    questMain.classList.add("menulv1-arrow");
    accountMain.classList.add("menulv1-arrow");
    // allRequest.classList.add("menulv2-arrow");
    // manageUser.classList.add("menulv2-arrow");
  }, []);

  const navigatePage = key => {
    let url;

    if (key.startsWith("_")) {
      url = `/admin/request?pageStatus=${key.split("_")[1]}`;
    } else if (key.startsWith("=")) {
      url = `/admin/manage-user/${key.split("=")[1]}`;
    } else {
      url = `/admin/${kebabCase(key)}`;
    }
    navigate(url);
  };

  /**
   * 메뉴 클릭 이벤트
   * @param {*} e event
   */
  const onClickMenu = e => {
    if (e.key === "_allRequest") e.stopPropagation();
    navigatePage(e.key);
  };

  return (
    <AdminMenuWrap className='w-[245px] px-4 border-e-[1px] shrink-0 '>
      <Menu
        onClick={onClickMenu}
        defaultOpenKeys={["questMain", "_allRequest", "accountMain"]}
        defaultSelectedKeys={["allRequest", "manage-user"]}
        mode='inline'
        className='w-full border-e-0'
        items={[
          {
            key: "questMain",
            label: <Menulv1 id='questMain'>의뢰함</Menulv1>,
            children: [
              {
                key: "_allRequest",
                icon: <SvgMailAll />,
                label: <Menulv2 id='allRequest'>{requestMenus.allRequest}</Menulv2>,
                onTitleClick: e => {
                  if (e && e.domEvent) {
                    e.domEvent.stopPropagation();
                  }
                  // setOpenKeys([]);
                  navigatePage("_allRequest");
                },
                children: [
                  {
                    key: "_waitContact",
                    label: <Menulv3>{requestMenus.waitContact}</Menulv3>,
                  },
                  {
                    key: "_inContact",
                    label: <Menulv3>{requestMenus.inContact}</Menulv3>,
                  },
                  {
                    key: "_endContact",
                    label: <Menulv3>{requestMenus.endContact}</Menulv3>,
                  },
                ],
              },

              {
                key: "_important",
                icon: <SvgMailStar />,
                label: <Menulv2>{requestMenus.important}</Menulv2>,
              },
              {
                key: "_endRequest",
                icon: <SvgMail />,
                label: <Menulv2>{requestMenus.endRequest}</Menulv2>,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            key: "accountMain",
            label: <Menulv1 id='accountMain'>계정</Menulv1>,
            children: [
              {
                key: "manageAdmin",
                icon: <SvgManageAdmin />,
                label: <Menulv2 className='menulv2'>{accountMenus.manageAdmin}</Menulv2>,
              },
              {
                key: "manageUser",
                label: <Menulv2 id='manageUser'>{accountMenus.manageUser}</Menulv2>,
                icon: <SvgManageUser />,
                children: [
                  {
                    key: "=all",
                    label: <Menulv3>{accountMenus.all}</Menulv3>,
                  },
                  {
                    key: "=pending",
                    label: <Menulv3>{accountMenus.pending}</Menulv3>,
                  },
                ],
              },
              {
                key: "manageEvent",
                icon: <SvgEvent />,
                label: <Menulv2>{accountMenus.manageEvent}</Menulv2>,
              },
            ],
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
  .ant-menu-sub .ant-menu-submenu-arrow {
    width: 40px;
    height: 40px;
    z-index: 100000;
    transform: none;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    position: relative;
    right: -20px;
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
  line-height: 18px;
  letter-spacing: -0.28px;
`;
