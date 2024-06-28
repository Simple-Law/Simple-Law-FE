import PropTypes from "prop-types";
import styled from "styled-components";
import { Tag } from "antd";

// Styled component for the Tag
const StyledTag = styled(Tag)`
  &.status-tag {
    font-size: 13px;
    font-weight: 400;
    line-height: 16px; /* 123.077% */
    letter-spacing: -0.26px;
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
    border: none;
    color: #ff9200;
    background: rgba(255, 146, 0, 0.12);
    &::before {
      background-color: #ff9200;
    }
  }

  &.status-tag.completed {
    border: none;
    background: rgba(0, 110, 37, 0.1);
    color: #006e25;
    &::before {
      background-color: #006e25;
    }
  }

  &.status-tag.pending {
    border: none;
    background: rgba(255, 66, 66, 0.12);
    color: #ff4242;
    &::before {
      background-color: #ff4242;
    }
  }

  &.status-tag.refuse {
    border: none;
    background: rgba(148, 163, 184, 0.1);
    color: #94a3b8;
    &::before {
      background-color: #94a3b8;
    }
  }

  &.status-tag.true {
    border: solid 1px #6e7780;
    background: #ffffff;
    color: #6e7780;
    &::before {
      background-color: #00bf40;
    }
  }

  &.status-tag.false {
    border: solid 1px #ff4242;
    background: #ffffff;
    color: #ff4242;
    &::before {
      background-color: #ff4242;
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

StatusTag.propTypes = {
  status: PropTypes.string.isRequired,
};

export const LoginStatusTag = ({ status }) => {
  console.log(status);
  return status ? (
    <StyledTag className={"status-tag true"}>활성화</StyledTag>
  ) : (
    <StyledTag className={"status-tag false"}>비활성화</StyledTag>
  );
};
LoginStatusTag.propTypes = {
  status: PropTypes.bool.isRequired,
};

export default StatusTag;
