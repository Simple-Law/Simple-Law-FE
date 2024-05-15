import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactComponent as Trash } from "assets/images/icons/trash.svg";
import { ReactComponent as Mail } from "assets/images/icons/mail.svg";
import { ReactComponent as MailStar } from "assets/images/icons/mailStar.svg";
import { ReactComponent as MailAll } from "assets/images/icons/mailAll.svg";
import { ReactComponent as ArrowDown } from "assets/images/icons/arrowDown.svg";
import { ReactComponent as ArrowUp } from "assets/images/icons/arrowUp.svg";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Button, Dropdown, Menu, Select, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment"; // Import moment
import StatusTag from "components/Tags";
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
      try {
        const response = await axios.get("http://localhost:4000/mails");
        const formattedData = response.data.map((item) => ({
          ...item,
          key: item.id,
          category: "Text",
          sentAt: moment(item.sentAt).format("YYYY. MM. DD"),
          time: item.time,
        }));
        const nonTrashData = formattedData.filter(
          (mail) => mail.statue !== "휴지통"
        );
        setData(formattedData);
        setMails(nonTrashData); // 전체보기에는 휴지통 제외

        const counts = {
          total: nonTrashData.length,
          preparing: formattedData.filter((mail) => mail.statue === "preparing")
            .length,
          pending: formattedData.filter((mail) => mail.statue === "pending")
            .length,
          completed: formattedData.filter((mail) => mail.statue === "completed")
            .length,
          refuse: formattedData.filter((mail) => mail.statue === "refuse")
            .length,
          important: formattedData.filter((mail) => mail.isImportant).length,
          trash: formattedData.filter((mail) => mail.statue === "휴지통")
            .length,
        };
        setCounts(counts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const menuItems = [
    {
      key: "All_request",
      label: (
        <span>
          전체 의뢰함{" "}
          <span style={{ color: "#2E7FF8", fontSize: "14px" }}>
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
              신청중{" "}
              <span style={{ color: "#2E7FF8", fontSize: "14px" }}>
                {counts.preparing}
              </span>
            </span>
          ),
        },
        {
          key: "pending",
          label: (
            <span>
              보류중{" "}
              <span style={{ color: "#2E7FF8", fontSize: "14px" }}>
                {counts.pending}
              </span>
            </span>
          ),
        },
        {
          key: "completed",
          label: (
            <span>
              신청완료{" "}
              <span style={{ color: "#2E7FF8", fontSize: "14px" }}>
                {counts.completed}
              </span>
            </span>
          ),
        },
        {
          key: "refuse",
          label: (
            <span>
              신청거절{" "}
              <span style={{ color: "#2E7FF8", fontSize: "14px" }}>
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
          중요 의뢰함{" "}
          <span style={{ color: "#2E7FF8", fontSize: "14px" }}>
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
          휴지통{" "}
          <span style={{ color: "#2E7FF8", fontSize: "14px" }}>
            {counts.trash}
          </span>
        </span>
      ),
      onTitleClick: () => handleMenuClick("trash"),
      icon: <Trash />,
    },
  ];
  const handleMenuClick = (statusKey) => {
    console.log(statusKey);
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
      await axios.patch(`http://localhost:4000/mails/${id}`, {
        isImportant: updatedItem.isImportant,
      });
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
            color: record.isImportant ? "gold" : "#CDD8E2",
          }}
        >
          {record.isImportant ? <FaStar /> : <FaRegStar />}
        </div>
      ),
    },
    {
      title: "상태",
      width: "10%",
      key: "statue",
      dataIndex: "statue",
      render: (statue) => <StatusTag status={statue} />,
    },
    { title: "분야", dataIndex: "category", key: "acategory", width: "10%" },
    { title: "세부 분야", dataIndex: "anytime", key: "anytime" },
    { title: "제목", dataIndex: "title", key: "title", width: "30%" },

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
      dataIndex: timeColumn,
      key: "time",
      render: (text) => <span>{text}</span>,
    },
  ];
  const paginationConfig = {
    pageSize: 10, // Set the number of items per page
    position: ["bottomCenter"],
  };
  return (
    <div className="flex w-full">
      <div className="w-[245px] px-4 h-screen border-e-[1px] shrink-0">
        <Button type="primary" block className="my-6">
          <Link to="/mail/quest">의뢰 요청하기</Link>
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
        <h2 className=" font-bold text-[20px] pb-3">전체 의뢰함</h2>
        <Table
          dataSource={mails}
          columns={columns}
          pagination={paginationConfig}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => navigate(`/detail/${record.key}`),
            };
          }}
        />
      </div>
    </div>
  );
};
export default QuestPage;
