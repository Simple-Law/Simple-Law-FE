import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactComponent as Trash } from "assets/images/icons/trash.svg";
import { ReactComponent as Mail } from "assets/images/icons/mail.svg";
import { ReactComponent as MailStar } from "assets/images/icons/mailStar.svg";
import { ReactComponent as MailAll } from "assets/images/icons/mailAll.svg";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Button, Menu, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment"; // Import moment
import StatusTag from "components/Tags";
const QuestPage = () => {
  const [mails, setMails] = useState([]);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/mails");
        const formattedData = response.data.map((item) => ({
          ...item,
          key: item.id,
          category: "Text",
          sentAt: moment(item.sentAt).format("YYYY. MM. DD"),
          isImportant: false, // Add isImportant flag to each item
        }));
        setData(formattedData); // Set the formatted data to state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the function on component mount
  }, []);

  const items = [
    {
      key: "All_request",
      label: "전체 의뢰함",
      icon: <MailAll />,
      onTitleClick: ({ key }) => navigate(`/board/${key}`), // 여기에 navigate 로직 추가
      children: [
        {
          key: "preparing",
          label: "신청중",
        },
        {
          key: "pending",
          label: "보류중",
        },
        {
          key: "completed",
          label: "신청완료",
        },
        {
          key: "refuse",
          label: "신청거절",
        },
      ],
    },
    {
      key: "sub2",
      label: "중요 의뢰함",
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
      key: "sub5",
      label: "휴지통",
      icon: <Trash />,
    },
  ];

  const onClick = async (e) => {
    const statusKey = e.key;
    const response = await axios.get("http://localhost:4000/mails");
    console.log(response);
    const filteredMails = response.data.filter(
      (mail) => mail.statue === statusKey
    );
    setMails(filteredMails); // 필터링된 메일 데이터 상태 업데이트
    navigate(`/board/${statusKey}`); // 필터링된 데이터와 함께 해당 경로로 이동
  };

  // 토글 중요성 함수
  const toggleImportant = (id, event) => {
    event.stopPropagation();
    const newData = data.map((item) =>
      item.id === id ? { ...item, isImportant: !item.isImportant } : item
    );
    setData(newData);
  };
  const columns = [
    // {
    //   key: "important",
    //   dataIndex: "important",
    //   width: 48,
    //   render: (_, record) => (
    //     <Button
    //       type="text"
    //       style={{
    //         height: "auto",
    //         padding: "0px",
    //         fontSize: "18px",
    //         color: "#CDD8E2",
    //       }}
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         toggleImportant(record.id, e);
    //       }}
    //       icon={record.isImportant ? <FaStar color="gold" /> : <FaRegStar />}
    //     />
    //   ),
    // },
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
    { title: "의뢰 요청시간", dataIndex: "sentAt", key: "sentAt" },
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
          items={items}
          className="w-full border-e-0"
        />
      </div>

      <div className="mt-6 mx-8 w-full">
        <h2 className=" font-bold text-[20px] pb-3">전체 의뢰함</h2>
        <Table
          dataSource={data}
          columns={columns}
          pagination={paginationConfig}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => navigate(`/detail/${rowIndex}`),
            };
          }}
        />
      </div>
    </div>
  );
};
export default QuestPage;
