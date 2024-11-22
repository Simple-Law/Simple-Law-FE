import * as yup from "yup";
import moment from "moment";

export const validationSchema = yup.object().shape({
  id: yup
    .string()
    .matches(/^[a-z0-9]{3,20}$/, "아이디는 영문 소문자와 숫자로 이루어진 3~20자로 입력해야 합니다!")
    .required("아이디는 필수로 입력해야 합니다!"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,.]).{8,16}$/,
      "비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자 중 2가지 이상을 사용해야 합니다.",
    )
    .required("비밀번호를 입력해주세요"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호를 재확인해주세요"),
  email: yup
    .string()
    .email("올바른 이메일 양식이 아닙니다.")
    .min(5, "이메일은 최소 5자 이상이어야 합니다.")
    .max(50, "이메일은 최대 50자까지 가능합니다.")
    .required("이메일은 필수로 입력해야 합니다!"),
  name: yup
    .string()
    .matches(/^[가-힣a-zA-Z]{1,10}$/, "이름은 한글 또는 영문으로 1~10자로 입력해야 합니다.")
    .required("이름은 필수로 입력해야 합니다."),
  birthDay: yup
    .string()
    .transform(value => value.replace(/\D/g, ""))
    .matches(/^\d{8}$/, "올바른 생년월일 형식(YYYYMMDD)이 아닙니다.")
    .test(
      "age-limit",
      "14세 미만은 가입이 불가능합니다.",
      value => moment().diff(moment(value, "YYYYMMDD"), "years") >= 14,
    )
    .required("생년월일을 입력하세요."),
  phoneNumber: yup
    .string()
    .transform(value => value.replace(/\D/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"))
    .matches(/^010-\d{4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다.")
    .required("전화번호는 필수로 입력해야 합니다."),
  verificationCode: yup
    .string()
    .matches(/^\d{6}$/, "인증번호는 6자리 숫자여야 합니다.")
    .required("인증번호를 입력하세요!"),
});

export const detailFormSchema = yup.object().shape({
  companyName: yup
    .string()
    .matches(/^[가-힣a-zA-Z0-9!@#$%^&*()_+|~=`{}[\]:;"'<>?,./\s-]{1,20}$/, "소속은 1~20자로 입력해야 합니다.")
    .required("소속을 입력해 주세요."),
  companyPhone: yup
    .string()
    .matches(/^(02|0[3-6][1-5]|0[7-9][0-8]|1\d{2})-\d{3,4}-\d{4}$/, "올바른 소속 전화번호 형식이 아닙니다.")
    .required("소속 전화번호를 입력해 주세요."),
  barExam: yup
    .string()
    .matches(/^[가-힣]{4,8}$/, "출신 시험은 4~8자의 한글로 입력해야 합니다.")
    .required("출신 시험을 입력해 주세요."),
  barExamCount: yup
    .string()
    .matches(/^\d{2,3}$/, "시험 횟수는 2~3자리 숫자로 입력해 주세요.")
    .required("시험 횟수를 입력해 주세요."),
  yearOfPassing: yup
    .string()
    .matches(/^\d{3,5}$/, "변호사 자격 획득 연도는 3~5자리 숫자로 입력해 주세요.")
    .required("변호사 자격 획득 연도를 입력해 주세요."),
  fileUploadId: yup.string().required("파일을 업로드해 주세요."),
});

export const findUserIdSchema = yup.object().shape({
  email: yup.string().email("올바른 이메일 양식이 아닙니다.").required("이메일은 필수로 입력해야 합니다!"),
});

export const findUserPWSchema = yup.object().shape({
  id: yup.string().required("아이디는 필수로 입력해야 합니다."),
  name: yup.string().required("이름은 필수로 입력해야 합니다."),
  phoneNumber: yup
    .string()
    .transform(value => value.replace(/\D/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"))
    .matches(/^010-\d{4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다.")
    .required("전화번호는 필수로 입력해야 합니다."),
  verificationCode: yup
    .string()
    .matches(/^\d{6}$/, "인증번호는 6자리 숫자여야 합니다.")
    .required("인증번호를 입력하세요!"),
});
