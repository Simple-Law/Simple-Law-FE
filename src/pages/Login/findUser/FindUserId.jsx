import LoginForm from "components/layout/AuthFormLayout";
import { Input, Button, Form } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { findUserIdSchema } from "utils/validations"; // 유효성 검사 스키마 가져오기
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
// import { useParams } from "react-router-dom";

const FindUserId = () => {
  // const { type } = useParams();

  const {
    control,
    handleSubmit: onSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(findUserIdSchema),
    mode: "onBlur",
  });

  const onFinish = async values => {
    console.log("폼 제출 값:", values);
    // 추가 로직 처리
  };

  return (
    <LoginForm title='아이디 찾기'>
      <Form onFinish={onSubmit(onFinish)}>
        <div className='flex gap-2 flex-col'>
          <Form.Item
            validateStatus={errors.email ? "error" : "success"}
            help={errors.email?.message || ""} // 에러 메시지를 표시
          >
            <Controller
              name='email'
              control={control}
              render={({ field }) => <Input placeholder='이메일 입력' {...field} />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              block
              className='px-4 py-3 h-12 text-base font-medium'
              htmlType='submit'
              disabled={!isValid}
            >
              아이디 정보 발송
            </Button>
          </Form.Item>
        </div>
      </Form>
    </LoginForm>
  );
};

FindUserId.propTypes = {
  handleData: PropTypes.func,
};

export default FindUserId;

// import LoginForm from "components/layout/AuthFormLayout";
// import { Input, Button, Form } from "antd";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { validationSchema } from "utils/validations"; // 유효성 검사 스키마 가져오기
// import PropTypes from "prop-types";
// import { useForm, Controller } from "react-hook-form";
// import { useEffect, useState } from "react";

// const FindUserId = () => {
//   const {
//     control,
//     handleSubmit: onSubmit,
//     formState: { errors, isValid },
//     watch,
//   } = useForm({
//     resolver: yupResolver(validationSchema),
//     mode: "onChange", // onBlur 대신 onChange로 변경
//   });

//   // 상태값을 추가하여 모든 필드가 채워졌는지 확인
//   const [isFormComplete, setIsFormComplete] = useState(false);

//   // watch()를 사용하여 필드 값이 모두 채워졌는지 확인
//   const watchedFields = watch(["name", "email"]); // name과 email 필드를 감시

//   useEffect(() => {
//     const isComplete = watchedFields.every(field => field && field.trim() !== ""); // 모든 필드가 채워졌는지 확인
//     console.log("필드 다 채워졋더?", isComplete);

//     setIsFormComplete(isComplete);
//   }, [watchedFields]);

//   const onFinish = async values => {
//     console.log("폼 제출 값:", values);
//     // 추가 로직 처리
//   };

//   return (
//     <LoginForm title='아이디 찾기'>
//       <Form onFinish={onSubmit(onFinish)}>
//         <div className='flex gap-2 flex-col'>
//           <Form.Item validateStatus={errors.name ? "error" : ""} help={errors.name?.message || ""}>
//             <Controller
//               name='name'
//               control={control}
//               render={({ field }) => <Input placeholder='이름 입력' {...field} />}
//             />
//           </Form.Item>

//           <Form.Item
//             validateStatus={errors.email ? "error" : "success"}
//             help={errors.email?.message || ""} // 에러 메시지를 표시
//           >
//             <Controller
//               name='email'
//               control={control}
//               render={({ field }) => <Input placeholder='이메일 입력' {...field} />}
//             />
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type='primary'
//               block
//               className='px-4 py-3 h-12 text-base font-medium'
//               htmlType='submit'
//               disabled={!isFormComplete} // 모든 필드가 유효하고 채워졌을 때만 활성화
//             >
//               아이디 찾기
//             </Button>
//           </Form.Item>
//         </div>
//       </Form>
//     </LoginForm>
//   );
// };

// FindUserId.propTypes = {
//   handleData: PropTypes.func,
// };

// export default FindUserId;
