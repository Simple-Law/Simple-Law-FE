import PropTypes from "prop-types";
import styled from "styled-components";
import { Tag } from "antd";
import { statusLabels, subStatusLabels } from "utils/statusLabels";

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
    border: none;
    background: rgba(148, 163, 184, 0.1); /* 기본 배경색 */
    color: #94a3b8; /* 기본 글자색 */

    &::before {
      content: "";
      width: 4px;
      height: 4px;
      display: block;
      border-radius: 50px;
      margin-right: 6px;
      background-color: #94a3b8; /* 기본 원 색상 */
    }
  }

  &.status-tag.contactRequest,
  &.status-tag.approvalPending,
  &.status-tag.requestInProgress {
    color: #ff9200;
    background: rgba(255, 146, 0, 0.12);
    &::before {
      background-color: #ff9200;
    }
  }

  &.status-tag.resolving {
    background: rgba(255, 66, 66, 0.12);
    color: #ff4242;
    &::before {
      background-color: #ff4242;
    }
  }

  &.status-tag.resolved {
    background: rgba(0, 110, 37, 0.1);
    color: #006e25;
    &::before {
      background-color: #006e25;
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
  &.status-tag.approved {
    border: solid 1px #4274ff;
    background: #ffffff;
    color: #4274ff;
    &::before {
      display: none;
    }
  }
`;

const StatusTag = ({ status, userType }) => {
  const getStatusText = (status, userType) => {
    if (statusLabels[userType]) {
      return statusLabels[userType][status] || "기타";
    }
    return "기타";
  };

  return <StyledTag className={`status-tag ${status}`}>{getStatusText(status, userType)}</StyledTag>;
};

StatusTag.propTypes = {
  status: PropTypes.string.isRequired,
  userType: PropTypes.oneOf(["LAWYER", "MEMBER", "guest"]).isRequired,
};

const DetailStatusTag = ({ status }) => {
  return <StyledTag className={`status-tag ${status}`}>{subStatusLabels[status]}</StyledTag>;
};

DetailStatusTag.propTypes = {
  status: PropTypes.string.isRequired,
  userType: PropTypes.oneOf(["LAWYER", "MEMBER", "guest"]).isRequired,
};

const LoginStatusTag = ({ status }) => {
  return status ? (
    <StyledTag className={"status-tag true"}>활성화</StyledTag>
  ) : (
    <StyledTag className={"status-tag false"}>비활성화</StyledTag>
  );
};

LoginStatusTag.propTypes = {
  status: PropTypes.bool.isRequired,
};

export { StatusTag, LoginStatusTag, DetailStatusTag };
