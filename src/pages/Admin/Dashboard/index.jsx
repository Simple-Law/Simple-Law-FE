import { Table } from "antd";
import StatusTag from "components/Tags";
import { useMailContext } from "contexts/MailContexts";
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { state } = useMailContext();
  const { mails } = state;
  console.log(mails);
  const columns = [
    {
      title: "상태",
      width: 150,
      key: "statue",
      dataIndex: "statue",
      render: statue => <StatusTag status={statue} />,
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
    { title: "제목", dataIndex: "title", key: "title" },
  ];

  const paginationConfig = {
    pageSize: 10, // Set the number of items per page
    position: ["bottomCenter"],
  };
  return (
    <div>
      <Table
        dataSource={mails}
        columns={columns}
        pagination={paginationConfig}
        style={{
          cursor: "pointer",
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => navigate(`read/${record.key}`),
          };
        }}
      />
    </div>
  );
};

export default Dashboard;
