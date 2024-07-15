import * as yup from "yup";
import moment from "moment";

export const validationSchema = yup.object().shape({
  id: yup
    .string()
    .matches(/^[a-z0-9]{4,16}$/, "아이디는 영문 소문자와 숫자로 이루어진 4~16자로 입력해야 합니다!")
    .required("아이디는 필수로 입력해야 합니다!"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,.]).{8,16}$/,
      "비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자 중 2가지 이상을 사용해야 합니다.",
    )
    .required("비밀번호를 입력해주세요"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호를 재확인해주세요"),
  email: yup.string().email("올바른 이메일 양식이 아닙니다.").required("이메일은 필수로 입력해야 합니다!"),
  name: yup.string().required("이름은 필수로 입력해야 합니다."),
  birthDay: yup
    .string()
    .matches(/^\d{4}\.\d{2}\.\d{2}$/, "올바른 날짜 형식이 아닙니다.")
    .test("valid-date", "올바른 날짜 형식이 아닙니다.", value => moment(value, "YYYY.MM.DD", true).isValid())
    .test(
      "age-limit",
      "14세 미만은 가입이 불가능합니다.",
      value => moment().diff(moment(value, "YYYY.MM.DD"), "years") >= 14,
    )
    .required("생년월일을 입력하세요."),
  gender: yup.string().required("성별을 선택하세요."),
  phoneNumber: yup
    .string()
    .matches(/^010-\d{4}-\d{4}$/, "올바른 전화번호 양식이 아닙니다.")
    .required("전화번호는 필수로 입력해야 합니다."),
  verificationCode: yup.string().required("인증번호를 입력하세요."),
});

export const detailFormSchema = yup.object().shape({
  companyName: yup.string().required("소속을 입력해 주세요.").trim(),
  companyPhone: yup
    .string()
    .matches(/^(02|0[3-6][1-5]|0[7-9][0-8]|1\d{2})-\d{3,4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다.")
    .required("소속 전화번호를 입력해 주세요."),
  barExam: yup.string().required("출신 시험을 입력해 주세요.").trim(),
  barExamCount: yup
    .string()
    .required("시험 횟수를 입력해 주세요.")
    .matches(/^\d+$/, "숫자만 입력해 주세요.")
    .matches(/^(0|[1-9]\d*)$/, "0번 이상의 숫자를 입력해 주세요."),
  yearOfPassing: yup
    .string()
    .required("변호사 자격 획득연도를 입력해 주세요.")
    .matches(/^\d{4}$/, "올바른 연도 형식이 아닙니다."),
  fileUploadId: yup.string().required("파일을 업로드해 주세요."),
});
