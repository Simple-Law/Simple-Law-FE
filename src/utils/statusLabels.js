import { all } from "axios";

const adminMenuLabels = {
  request: {
    allRequest: {
      this: "전체의뢰함",
      waitContact: "컨택 예정",
      inContact: "컨택 진행 중",
      endContact: "컨택 완료",
    },
    important: "중요 의뢰함",
    endRequest: "종료된 의뢰함",
  },
  account: {
    manageAdmin: "관리자 계정 관리",
    manageUser: {
      this: "회원관리",
      all: "전체 회원",
      pending: "회원가입 요청",
    },
    manageEvent: "이벤트 관리",
  },
};

const commonStatusLabels = {
  All_request: "전체 의뢰함",
  important: "중요 의뢰함",
  trash: "휴지통",
  endRequest: "종료된 의뢰함",
};

const statusLabels = {
  LAWYER: {
    IN_CONTACT: "컨택 요청 중",
    IN_PROGRESS: "해결 진행 중",
    RESPONSE: "해결 완료",
    DONE: "의뢰 종료",
  },
  MEMBER: {
    REQUEST: "요청 진행 중",
    IN_PROGRESS: "해결 진행 중",
    RESPONSE: "해결 완료",
    DONE: "의뢰 종료",
  },
  guest: {
    requestInProgress: "비로그인 요청 중",
    resolving: "비로그인 해결 진행 중",
    resolved: "비로그인 해결 완료",
  },
};
const subStatusLabels = {
  assignLawyer: "변호사 배정 중",
  extReject: "연장 제안 거절",
  extAccept: "연장 제안 승인",
  extRequest: "연장 제안 요청",
  approved: "승인 완료",
  addQuestion: "추가 질문",
};

const menuStatusTypes = {
  ADMIN: {
    allRequest: ["WAIT_CONTACT", "IN_CONTACT", "IN_ASSIGN"],
    waitContact: ["WAIT_CONTACT"],
    inContact: ["IN_CONTACT", "IN_ASSIGN"],
    endContact: ["ASSIGN"],
    important: ["IMPORTANT"],
    done: ["DONE"],
  },
  LAWYER: {
    IN_CONTACT: ["IN_CONTACT"],
    IN_PROGRESS: ["IN_PROGRESS"],
    RESPONSE: ["RESPONSE"],
    DONE: ["DONE"],
  },
  MEMBER: {
    REQUEST: ["REQUEST"],
    IN_PROGRESS: ["IN_PROGRESS"],
    RESPONSE: ["RESPONSE"],
    DONE: ["DONE"],
  },
  guest: {
    requestInProgress: ["requestInProgress"],
    resolving: ["resolving"],
    resolved: ["resolved"],
  },
};

const categoryLabels = [
  { value: "주주간 계약서", label: "주주간 계약서" },
  { value: "동업 계약서", label: "동업 계약서" },
  { value: "용역(개발, 디자인 등) 계약서", label: "용역(개발, 디자인 등) 계약서" },
  { value: "근로 계약서", label: "근로 계약서" },
  { value: "거래 계약서", label: "거래 계약서" },
  { value: "투자 계약서", label: "투자 계약서" },
  { value: "스톡옵션 계약서", label: "스톡옵션 계약서" },
  { value: "비밀유지(보안) 계약서", label: "비밀유지(보안) 계약서" },
  { value: "이익 분배 계약서", label: "이익 분배 계약서" },
  { value: "저작권 이용허락(양도 등) 계약서", label: "저작권 이용허락(양도 등) 계약서" },
  { value: "기타 계약서", label: "기타 계약서" },
];

const anytimeLabels = [
  { value: "계약서 검토/작성", label: "계약서 검토/작성" },
  { value: "약관 검토/작성", label: "약관 검토/작성" },
  { value: "개인정보 처리방침 검토/작성", label: "개인정보 처리방침 검토/작성" },
  { value: "법률검토 의견서 작성", label: "법률검토 의견서 작성" },
  { value: "내용 증명 작성", label: "내용 증명 작성" },
  { value: "분쟁 해결 자문", label: "분쟁 해결 자문" },
  { value: "등기", label: "등기" },
];
export {
  categoryLabels,
  anytimeLabels,
  commonStatusLabels,
  statusLabels,
  subStatusLabels,
  menuStatusTypes,
  adminMenuLabels,
};
