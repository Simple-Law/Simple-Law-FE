// 생년월일 포맷팅 함수
export const formatBirthday = value => {
  const cleanedValue = value.replace(/\D/g, ""); // 숫자만 남기기
  return cleanedValue.length === 8 ? cleanedValue.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3") : value;
};

// 전화번호 포맷팅 함수
export const formatPhoneNumber = value => {
  const cleanedValue = value.replace(/\D/g, ""); // 숫자만 남기기
  return cleanedValue.length === 11 ? cleanedValue.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3") : value;
};
