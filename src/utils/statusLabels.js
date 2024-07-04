const commonStatusLabels = {
  All_request: "전체 의뢰함",
  important: "중요 의뢰함",
  trash: "휴지통",
};

const statusLabels = {
  lawyer: {
    preparing: "컨택 요청 중",
    pending: "해결 진행 중",
    completed: "해결 완료",
    refuse: "신청거절",
  },
  quest: {
    preparing: "의뢰 요청 중",
    pending: "해결 진행 중",
    completed: "해결 완료",
    refuse: "신청거절",
  },
  guest: {
    preparing: "비로그인 요청 중",
    pending: "비로그인 해결 진행 중",
    completed: "비로그인 해결 완료",
    refuse: "비로그인 신청거절",
  },
};

export { commonStatusLabels, statusLabels };
