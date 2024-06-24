export const validateRequired = (inputLabel, whitespace = true) => {
  return {
    required: true,
    whitespace: whitespace,
    message: `${inputLabel} 을/를 입력해주세요`,
  };
};

export const validatePassword = (_, value) => {
  if (!value) {
    return Promise.resolve(); // 이미 required rule에서 메시지를 처리하므로 여기서는 resolve
  }
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isValid = (hasUpperCase ? 1 : 0) + (hasLowerCase ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecialChar ? 1 : 0) >= 3;

  console.log(`비밀번호 검증:
    대문자 포함: ${hasUpperCase},
    소문자 포함: ${hasLowerCase},
    숫자 포함: ${hasNumber},
    특수문자 포함: ${hasSpecialChar},
    유효성: ${isValid}
  `);

  if (value.length < 8 || value.length > 16 || !isValid) {
    return Promise.reject(
      new Error("비밀번호 취약 : 8~16자의 영문 대/소문자, 숫자, 특수문자 중 2가지 이상을 사용해야 합니다."),
    );
  }
  return Promise.resolve();
};

export const validateEmailType = () => {
  return {
    whitespace: true,
    required: true,
    type: "email",
    message: "올바른 이메일 양식이 아닙니다.",
  };
};

export const validateEmailRegex = () => {
  return {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "이메일은 영문자와 숫자로만 이루어져야 합니다.",
  };
};
