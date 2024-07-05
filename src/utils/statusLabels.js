const commonStatusLabels = {
  All_request: "전체 의뢰함",
  important: "중요 의뢰함",
  trash: "휴지통",
  endRequest: "종료된 의뢰함",
};

const statusLabels = {
  LAWYER: {
    contactRequest: "컨택 요청 중",
    approvalPending: "승인 완료 중",
    resolving: "해결 진행 중",
    resolved: "해결 완료",
  },
  MEMBER: {
    requestInProgress: "요청 진행 중",
    resolving: "해결 진행 중",
    resolved: "해결 완료",
  },
  guest: {
    requestInProgress: "비로그인 요청 중",
    resolving: "비로그인 해결 진행 중",
    resolved: "비로그인 해결 완료",
  },
};

export { commonStatusLabels, statusLabels };
