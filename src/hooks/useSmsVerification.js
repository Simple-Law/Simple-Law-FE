// hooks/useSmsVerification.js
import { useState, useCallback } from "react";
import { sendSms, verifySms } from "apis/smsApi";

export const useSmsVerification = smsType => {
  const [status, setStatus] = useState("");
  const [timer, setTimer] = useState(0);

  // 인증 번호 전송 함수
  const sendCode = useCallback(
    async phone => {
      setStatus("sending");
      try {
        const data = await sendSms(phone, smsType);
        // data.content가 "SEND" 등으로 온다고 가정
        setStatus("sent");
        // TODO: 타이머 설정
        return data;
      } catch (error) {
        setStatus("failed");
        throw error;
      }
    },
    [smsType],
  );

  // 인증 번호 검증 함수
  const verifyCode = useCallback(
    async (phone, code) => {
      setStatus("verifying");
      try {
        const data = await verifySms(phone, code, smsType);
        setStatus("verified");
        return data;
      } catch (error) {
        setStatus("failed");
        throw error;
      }
    },
    [smsType],
  );

  return { status, timer, sendCode, verifyCode, setTimer };
};
