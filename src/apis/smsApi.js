import axiosInstance from "./axiosConfig";

/**
 * SMS 전송 API 함수
 * @param {String} phone - 전화번호 (xxx-xxxx-xxxx 형식)
 * @param {String} type - sms 전송 유형 ("sign-up", "account", "password")
 * @returns {Promise} 응답 데이터
 */
export const sendSms = async (phone, type) => {
  let endpoint = "";
  switch (type) {
    case "sign-up":
      endpoint = "/api/v1/auth/sms/sign-up";
      break;
    case "account":
      endpoint = "/api/v1/auth/sms/account";
      break;
    case "password":
      endpoint = "/api/v1/auth/sms/password";
      break;
    default:
      throw new Error("Invalid SMS type");
  }
  const response = await axiosInstance.post(endpoint, { phone });
  return response.data;
};

/**
 * SMS 인증 API 함수
 * @param {String} phone - 전화번호 (xxx-xxxx-xxxx 형식)
 * @param {String} verificationCode - 인증번호
 * @param {String} type - sms 인증 유형 ("sign-up", "account", "password")
 * @returns {Promise} 응답 데이터
 */
export const verifySms = async (phone, verificationCode, type) => {
  let endpoint = "";
  switch (type) {
    case "sign-up":
      endpoint = "/api/v1/auth/sms/sign-up/verification";
      break;
    case "account":
      endpoint = "/api/v1/auth/sms/account/verification";
      break;
    case "password":
      endpoint = "/api/v1/auth/sms/password/verification";
      break;
    default:
      throw new Error("Invalid SMS type");
  }
  const response = await axiosInstance.post(endpoint, { phone, verificationCode });
  return response.data;
};
