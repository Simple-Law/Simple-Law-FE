import { verifyAuthCode } from "apis/usersApi";
import { sendAuthCodeAction } from "../redux/actions/authActions";
import { useDispatch } from "react-redux";
import { useMessageApi } from "components/messaging/MessageProvider";
import { useState, useEffect } from "react";

export const useAuthCode = (watch, setShowAuthenticationCodeField, setValue) => {
  const messageApi = useMessageApi();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    return () => {
      if (countdown) {
        clearInterval(countdown);
      }
    };
  }, [countdown]);

  // 타이머 시작 함수
  const startTimer = seconds => {
    setTimer(seconds);
    if (countdown) clearInterval(countdown); // 기존 타이머 초기화
    const newCountdown = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(newCountdown);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    setCountdown(newCountdown); // 새로운 타이머 저장
  };

  // 인증번호 전송
  const handleSendAuthCode = async type => {
    const phoneNumber = watch("phoneNumber");
    const name = watch("name");
    if (!phoneNumber || !name) {
      messageApi.error("이름과 휴대전화 번호를 입력하세요.");
      return;
    }

    const cleanedPhoneNumber = phoneNumber.replace(/-/g, "");

    try {
      await dispatch(sendAuthCodeAction(cleanedPhoneNumber, type));
      messageApi.success("인증번호가 발송되었습니다.");
      setShowAuthenticationCodeField(true);
      startTimer(180); // 3분 타이머 시작
    } catch (error) {
      console.error("Error in handleSendAuthCode:", error);
      messageApi.error("인증번호 발송에 실패했습니다.");
      setShowAuthenticationCodeField(false);
    }
  };

  // 인증번호 검증
  const handleVerifyAuthCode = async type => {
    const phoneNumber = watch("phoneNumber").replace(/-/g, "");
    const verificationCode = watch("verificationCode");
    if (!phoneNumber || !verificationCode) {
      messageApi.error("휴대전화 번호와 인증번호를 입력하세요.");
      return false;
    }

    try {
      await verifyAuthCode(phoneNumber, verificationCode, type);
      return true;
    } catch (error) {
      console.error("Error in handleVerifyAuthCode:", error);
      messageApi.error("인증번호가 올바르지 않습니다. 확인 후 다시 입력해 주세요.");
      return false;
    }
  };

  // 인증번호 입력 핸들러
  const handleAuthCodeChange = e => {
    const { value } = e.target;
    setValue("verificationCode", value); // react-hook-form의 setValue를 사용
  };

  // 타이머 포맷 함수
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return { handleSendAuthCode, handleVerifyAuthCode, handleAuthCodeChange, formatTime, timer };
};
