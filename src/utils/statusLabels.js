const commonStatusLabels = {
  All_request: "전체 의뢰함",
  important: "중요 의뢰함",
  trash: "휴지통",
  endRequest: "종료된 의뢰함",
};

const statusLabels = {
  ADMIN: {
    preparing: "컨택 예정",
    pending: "컨텍 진행 중",
    completed: "컨텍 완료",
  },
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

const adminStatusLabels = {
  manageAdmin: "관리자 계정 관리",
  manageUser: "회원 관리",
  allUser: "전체 사용자",
  requestSignup: "회원가입 요청",
  manageEvent: "이벤트 관리",
};

export { commonStatusLabels, statusLabels, adminStatusLabels };
