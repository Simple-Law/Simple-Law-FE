import React, { useEffect, useRef, useState } from "react";
import Logo from "assets/images/icons/Logo.svg";
import { Form, Checkbox, Modal, Input } from "antd";
import { useFormik } from "formik";

import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import { styled } from "styled-components";
import { getMailById, createMail, fetchMails } from "apis/mailsApi";
import { useMailContext } from "contexts/MailContexts";
import CommonForm from "components/CommonForm";
import moment from "moment";
import { useMessageApi } from "components/MessageProvider";

const ReQuestion = () => {
  const { id } = useParams();
  const editorRef = useRef();
  const navigate = useNavigate();
  const { dispatch } = useMailContext();
  const [mail, setMail] = useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const messageApi = useMessageApi();
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scroll on mount
    return () => {
      document.body.style.overflow = "auto"; // Enable scroll on unmount
    };
  }, []);

  useEffect(() => {
    const fetchMail = async () => {
      try {
        const data = await getMailById(id);
        setMail(data);
      } catch (error) {
        console.error("Error fetching mail:", error);
      }
    };
    fetchMail();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      category: "",
      time: "",
      status: "preparing",
      parentId: id,
    },
    onSubmit: async values => {
      const currentTime = new Date().toISOString();
      const dataToSend = {
        ...values,
        status: values.status || "preparing",
        sentAt: currentTime,
      };
      try {
        const response = await createMail(dataToSend);
        console.log("Server Response:", response);
        messageApi.success("게시글이 등록되었습니다!");

        const { data: mailData } = await fetchMails();
        dispatch({ type: "SET_DATA", payload: mailData });
        dispatch({ type: "SET_MAILS", payload: mailData.filter(mail => mail.status !== "휴지통") });
        dispatch({ type: "UPDATE_COUNTS", payload: mailData });

        formik.resetForm();
        navigate("/board");
      } catch (error) {
        console.error("Error sending mail:", error);
        messageApi.error("게시글 등록이 실패했습니다!");
      }
    },
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    // 제출은 잠시 멈춰
    // formik.handleSubmit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    const markdown = editorRef.current.getEditor().root.innerHTML;
    formik.setFieldValue("content", markdown, false);
    showModal();
  };

  const handleCheckboxChange = e => {
    setIsCheckboxChecked(e.target.checked);
  };

  if (!mail) {
    return <div>Loading...</div>;
  }

  return (
    <div className='overflow-hidden'>
      <div className='border-b-[1px] w-full h-[100px] fixed bg-white top-0 left-0 z-[1000]'>
        <div className='flex justify-between items-center w-[1300px] mx-auto h-[100px]'>
          <div>
            <Link to='/'>
              <img src={Logo} alt='' className='mx-auto w-[140px]' />
            </Link>
          </div>
        </div>
      </div>
      <FormDiv className='w-[1300px] mx-auto mt-[100px]'>
        <Form onFinish={handleSubmit} className='flex'>
          <div className='left-side'>
            <div className='w-[400px] pt-[40px]'>
              <h2 className='text-2xl font-bold mb-6'>의뢰 요청서</h2>
              <div className='flex flex-col gap-8'>
                <div>
                  <p>{mail.title}</p>
                </div>
                <div>
                  <p>의뢰 내용</p>
                  <div dangerouslySetInnerHTML={{ __html: mail.content }} />
                </div>
                <div>
                  <p>답변</p>
                  {mail.replies &&
                    mail.replies.map((reply, index) => (
                      <div key={index} className='p-2 bg-gray-100 rounded-md mb-2'>
                        <div className='text-gray-700'>{reply.content}</div>
                        <div className='text-gray-500 text-sm'>
                          {moment(reply.createdAt).format("YYYY년 MM월 DD일 A h:mm")}
                        </div>
                      </div>
                    ))}
                </div>
                <Checkbox onChange={handleCheckboxChange} style={{ color: "#999" }}>
                  안내 사항을 모두 확인했으며, 동의합니다.
                </Checkbox>
              </div>
              <div className='mt-10 w-full h-[58px] px-5 py-4 bg-blue-500 bg-opacity-10 rounded-md justify-between items-center inline-flex'>
                <div className="text-blue-500 text-base font-semibold font-['Pretendard'] leading-tight">
                  총 결제 금액
                </div>
                <div className='justify-start items-center gap-0.5 flex'>
                  <div className="text-right text-blue-500 text-[22px] font-bold font-['Pretendard']">120,000</div>
                  <div className="text-right text-blue-500 text-base font-semibold font-['Pretendard'] leading-tight">
                    원
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CommonForm formik={formik} editorRef={editorRef} isCheckboxChecked={isCheckboxChecked} />
        </Form>
        <Modal title='제출 확인' open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <p>진짜로 제출하시겠습니까?</p>
        </Modal>
      </FormDiv>
    </div>
  );
};

const FormDiv = styled.div`
  p:not(.toastui-editor-defaultUI p) {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 125% */
    letter-spacing: -0.32px;
    margin-bottom: 8px;
    span {
      color: #94a3b8;
      margin-left: 6px;
    }
  }
  .left-side {
    width: 461px; /* 너비를 고정 */
    height: calc(100vh - 100px);
    padding-bottom: 185px;
    overflow-y: auto; /* 세로 스크롤만 추가 */
    position: relative; /* 필요에 따라 위치 설정 */
  }
  .right-side {
    width: calc(100% - 461px); /* 전체 너비에서 left-side 너비를 뺀 나머지 */
    height: auto;
    padding: 20px 0;
    overflow-y: hidden; /* 세로 스크롤 비활성화 */
    position: relative; /* 필요에 따라 위치 설정 */
  }
`;

export default ReQuestion;
