import React from "react";
import styled from "styled-components";
import { Tag } from "antd";

// Styled component for the Tag
const StyledTag = styled(Tag)`
  &.status-tag {
    font-size: 13px;
    font-weight: 400;
    line-height: 16px; /* 123.077% */
    letter-spacing: -0.26px;
    border: none;
    padding: 3px 8px;
    display: inline-flex;
    align-items: center;
    margin-inline-end: 0;

    &::before {
      content: "";
      width: 4px;
      height: 4px;
      display: block;
      border-radius: 50px;
      margin-right: 6px;
    }
  }
  &.status-tag.preparing {
    color: #ff9200;
    background: rgba(255, 146, 0, 0.12);
    &::before {
      background-color: #ff9200;
    }
  }

  &.status-tag.completed {
    background: rgba(0, 110, 37, 0.1);
    color: #006e25;
    &::before {
      background-color: #006e25;
    }
  }

  &.status-tag.pending {
    background: rgba(255, 66, 66, 0.12);
    color: #ff4242;
    &::before {
      background-color: #ff4242;
    }
  }

  &.status-tag.refuse {
    background: rgba(148, 163, 184, 0.1);
    color: #94a3b8;
    &::before {
      background-color: #94a3b8;
    }
  }
`;

const StatusTag = ({ status }) => {
  const getStatusText = status => {
    switch (status) {
      case "pending":
        return "재검토 요청";
      case "completed":
        return "해결 완료";
      case "refuse":
        return "의뢰 종료";
      case "preparing":
        return "요청 진행 중";
      default:
        return "기타";
    }
  };

  return <StyledTag className={`status-tag ${status}`}>{getStatusText(status)}</StyledTag>;
};

export const AdminTag = ({ role }) => {
  const tagAttr = {};
  switch (role) {
    case "MASTER":
      tagAttr.text = "마스터";
      tagAttr.color = "processing";
      break;
    case "TOP":
      tagAttr.text = "최고 관리자";
      tagAttr.color = "green";
      break;
    default:
      tagAttr.text = "일반 관리자";
      tagAttr.color = "default";
      break;
  }

  return (
    <Tag bordered={false} color={tagAttr.color}>
      {tagAttr.text}
    </Tag>
  );
};

export default StatusTag;
