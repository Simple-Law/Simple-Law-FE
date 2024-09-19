import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spin, Form } from "antd";
import SvgLogo from "components/Icons/Logo";
import ConfirmModal from "components/modal/ConfirmModal";
import { useSelector } from "react-redux";
import { useMail } from "hooks/useMail";
import CommonForm from "./CommonForm";
import LeftSideContent from "./LeftSideContent";
import { FormDiv } from "./styles";

const PostEditor = () => {
  const { id, mode } = useParams();
  const editorRef = useRef();
  const user = useSelector(state => state.auth.user);

  const { formik, loading, existingMail, setPendingFiles } = useMail(id, mode, user, editorRef);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    formik.handleSubmit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    showModal();
  };

  return (
    <div>
      <div className='border-b-[1px] w-full h-[100px] fixed bg-white top-0 left-0 z-[1000]'>
        <div className='flex justify-between items-center w-[1300px] mx-auto h-[100px]'>
          <div>
            {/* <Link to='/'>
              <SvgLogo width='140px' height='36px' className='mx-auto' />
            </Link> */}
          </div>
        </div>
      </div>
      <FormDiv className='w-[1300px] mx-auto mt-[100px] relative'>
        {/* <FormDiv className='w-full max-w-[1300px] mx-auto mt-[100px] relative'> */}
        <h2 className='text-2xl font-bold mb-6 absolute top-[40px] left-0'>의뢰 요청서</h2>
        <Form onFinish={handleSubmit} className='flex pt-24'>
          <div className='left-side'>
            {loading ? <Spin /> : <LeftSideContent existingMail={existingMail} formik={formik} />}
          </div>
          <CommonForm
            formik={formik}
            editorRef={editorRef}
            setPendingFiles={setPendingFiles} // 문서 첨부 파일 설정 함수 전달
            mode={mode || "default"} // mode가 없을 경우 기본 값을 설정
          />
        </Form>
        <ConfirmModal title='제출 확인' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <p>진짜로 제출하시겠습니까?</p>
        </ConfirmModal>
      </FormDiv>
    </div>
  );
};

export default PostEditor;
