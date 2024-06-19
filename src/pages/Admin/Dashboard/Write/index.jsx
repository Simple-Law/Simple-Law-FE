import React, { useEffect, useRef, useState } from "react";
import Logo from "assets/images/icons/Logo.svg";

import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";

import { useMessageApi } from "components/MessageProvider";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { createMail, fetchMails, getMailById } from "apis/mailsApi";
import { useMailContext } from "contexts/MailContexts";
import CommonForm from "components/CommonForm";

const QuestPost = () => {
  const editorRef = useRef();
  const navigate = useNavigate();
  const { dispatch } = useMailContext();
  const [mails, setMails] = useState([]);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const messageApi = useMessageApi();

  useEffect(() => {
    // 컴포넌트가 마운트되면 실행
    document.body.style.overflow = "hidden"; // 스크롤 비활성화

    const fetchData = async () => {
      try {
        const data = await fetchMails();
        setMails(data);
      } catch (error) {
        console.error("Error fetching mails:", error);
      }
    };

    fetchData();
    return () => {
      // 컴포넌트가 언마운트되면 실행
      document.body.style.overflow = "auto"; // 스크롤 활성화
    };
  }, []);

  // Formik hook을 사용하여 폼 상태 관리
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      category: "",
      time: "",
      status: "preparing",
    },
    onSubmit: async values => {
      const currentTime = new Date().toISOString(); // ISO 8601 포맷의 문자열로 날짜와 시간을 가져옵니다.
      const dataToSend = {
        ...values,
        sentAt: currentTime, // 데이터 객체에 현재 시간 필드를 추가합니다.
      };
      try {
        // 에디터 내용과 셀렉트박스 값이 포함된 values를 서버로 전송
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

  // 모달을 열기
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 모달에서 '확인'을 누르면
  const handleOk = () => {
    setIsModalVisible(false);
    formik.handleSubmit(); // 폼 제출
  };

  // 모달에서 '취소'를 누르면
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    const markdown = editorRef.current.getEditor().root.innerHTML;
    formik.setFieldValue("content", markdown, false);
    showModal(); // 제출 전 모달 보여주기
  };

  const handleCheckboxChange = e => {
    setIsCheckboxChecked(e.target.checked);
  };

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
                {mails.map(mail => (
                  <div key={mail.id}>
                    <p className='font-semibold'>{mail.title}</p>
                    <div dangerouslySetInnerHTML={{ __html: mail.content }} />
                    {mail.replies &&
                      mail.replies.map((reply, index) => (
                        <div key={index} className='ml-4'>
                          <p className='font-semibold'>답변:</p>
                          <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                        </div>
                      ))}
                  </div>
                ))}
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

const StyledList = styled.ul`
  counter-reset: list-number;

  & > li {
    position: relative;
    padding-left: 15px; /* 공간 확보를 위해 왼쪽에 패딩을 추가 */
    line-height: 24px;

    &:before {
      content: counter(list-number) ".";
      counter-increment: list-number;
      position: absolute; /* 숫자를 절대 위치로 고정 */
      left: 0; /* 왼쪽에 고정 */
      top: 0; /* 위쪽에 고정 */
      width: 15px; /* 숫자가 들어갈 공간의 폭 지정 */
      text-align: left; /* 숫자를 오른쪽 정렬 */
    }
  }
  & ul {
    list-style: disc;

    & li {
      line-height: 24px;
      &:before {
        content: "";
      }
    }
  }
`;

export default QuestPost;
