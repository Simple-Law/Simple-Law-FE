import React, { useEffect, useRef, useState } from "react";
import Logo from "assets/images/icons/Logo.svg";
import { Input, Form, Select, Button, Checkbox, Modal } from "antd";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/i18n/ko-kr";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useFormik } from "formik";
import axios from "axios";

import { useMessageApi } from "components/AppLayout";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { createMail } from "components/apis/mailsApi";

const QuestPost = () => {
  const editorRef = useRef();
  const navigate = useNavigate();

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 상태
  const messageApi = useMessageApi();

  useEffect(() => {
    // 컴포넌트가 마운트되면 실행
    document.body.style.overflow = "hidden"; // 스크롤 비활성화

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
      statue: "preparing",
    },
    onSubmit: async (values) => {
      const currentTime = new Date().toISOString(); // ISO 8601 포맷의 문자열로 날짜와 시간을 가져옵니다.
      const dataToSend = {
        ...values,
        statue: values.statue || "preparing",
        sentAt: currentTime, // 데이터 객체에 현재 시간 필드를 추가합니다.
      };
      try {
        // 에디터 내용과 셀렉트박스 값이 포함된 values를 서버로 전송
        const response = await createMail(dataToSend);
        console.log("Server Response:", response);
        messageApi.success("게시글이 등록되었습니다!");
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
    const markdown = editorRef.current.getInstance().getMarkdown();
    formik.setFieldValue("content", markdown, false);
    showModal(); // 제출 전 모달 보여주기
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  return (
    <div className=" overflow-hidden">
      <div className=" border-b-[1px] w-full  h-[100px] fixed bg-white top-0 left-0 z-[1000] ">
        <div className="flex justify-between items-center w-[1300px] mx-auto  h-[100px]">
          <div>
            <Link to="/">
              <img src={Logo} alt="" className="mx-auto w-[140px]" />
            </Link>
          </div>
        </div>
      </div>
      <FormDiv className="w-[1300px] mx-auto mt-[100px]">
        <Form onFinish={handleSubmit} className="flex">
          <div className="left-side">
            <div className="w-[400px] pt-[40px]">
              <h2 className="text-2xl font-bold mb-6">의뢰 요청서</h2>
              <div className="flex flex-col gap-8">
                <Form.Item>
                  <p>상태</p>
                  <Select
                    name="statue"
                    placeholder="상태"
                    onChange={(value) => formik.setFieldValue("statue", value)}
                    options={[
                      {
                        value: "preparing",
                        label: "매칭준비중",
                      },
                      {
                        value: "pending",
                        label: "매칭보류",
                      },
                      {
                        value: "completed",
                        label: "매칭완",
                      },
                      {
                        value: "refuse",
                        label: "매칭거절",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item>
                  <p>분야 선택</p>
                  <Select
                    name="anytime"
                    placeholder="분야 선택"
                    onChange={(value) => formik.setFieldValue("anytime", value)}
                    options={[
                      {
                        value: "계약서 검토/작성",
                        label: "계약서 검토/작성",
                      },
                      {
                        value: "약관 검토/작성",
                        label: "약관 검토/작성",
                      },
                      {
                        value: "개인정보 처리방침 검토/작성",
                        label: "개인정보 처리방침 검토/작성",
                      },
                      {
                        value: "법률검토 의견서 작성",
                        label: "법률검토 의견서 작성",
                      },
                      { value: "내용 증명 작성", label: "내용 증명 작성" },
                      { value: "분쟁 해결 자문", label: "분쟁 해결 자문" },
                      { value: "등기", label: "등기" },
                    ]}
                  />
                </Form.Item>
                <Form.Item>
                  <p>세부 분야 선택</p>
                  <Select
                    name="category"
                    placeholder="세부 분야 선택"
                    onChange={(value) =>
                      formik.setFieldValue("category", value)
                    }
                  >
                    <Select.Option class="text-gray-500" value="주주간 계약서">
                      주주간 계약서
                    </Select.Option>
                    <Select.Option class="text-gray-500" value="동업 계약서">
                      동업 계약서
                    </Select.Option>
                    <Select.Option
                      class="text-gray-500"
                      value="용역(개발, 디자인 등) 계약서"
                    >
                      용역(개발, 디자인 등) 계약서
                    </Select.Option>
                    <Select.Option class="text-gray-500" value="근로 계약서">
                      근로 계약서
                    </Select.Option>
                    <Select.Option class="text-gray-500" value="거래 계약서">
                      거래 계약서
                    </Select.Option>
                    <Select.Option class="text-gray-500" value="투자 계약서">
                      투자 계약서
                    </Select.Option>
                    <Select.Option
                      class="text-gray-500"
                      value="스톡옵션 계약서"
                    >
                      스톡옵션 계약서
                    </Select.Option>
                    <Select.Option
                      class="text-gray-500"
                      value="비밀유지(보안) 계약서"
                    >
                      비밀유지(보안) 계약서
                    </Select.Option>
                    <Select.Option
                      class="text-gray-500"
                      value="이익 분배 계약서"
                    >
                      이익 분배 계약서
                    </Select.Option>
                    <Select.Option
                      class="text-gray-500"
                      value="저작권 이용허락(양도 등) 계약서"
                    >
                      저작권 이용허락(양도 등) 계약서
                    </Select.Option>
                    <Select.Option class="text-gray-500" value="기타 계약서">
                      기타 계약서
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <p>의뢰 작업 기한</p>
                  <Select
                    name="time"
                    placeholder="의뢰 작업 기한"
                    onChange={(value) => formik.setFieldValue("time", value)}
                  >
                    <Select.Option value="12">12시간</Select.Option>
                    <Select.Option value="24">24시간</Select.Option>
                  </Select>
                </Form.Item>
                <div>
                  <p>의뢰 등록 전 안내사항</p>
                  <StyledList className=" rounded-md bg-slate-100 px-5 py-5 mb-[10px]">
                    <li>
                      요청이 완료된 의뢰는 수정이 불가합니다. 수정을 원하실 경우
                      기존 의뢰를 종료하신 후 새로운 의뢰서를 작성해주세요.
                    </li>
                    <li>
                      변호사의 배정 전 의뢰 취소를 진행할 경우 전액 환불이
                      가능하며, 변호사의 배정 이후 의뢰 취소는 불가능 합니다.
                    </li>
                    <li>
                      변호사 배정이 완료된 의뢰는 의뢰가 종료될 때 까지 글
                      삭제가 불가능 합니다.
                    </li>
                    <li>
                      작성된 내용은 배정된 변호사 이외에 누구에게도 공개되지
                      않습니다.
                    </li>
                    <li>
                      아래 사항에 해당할 경우, 서비스 이용이 제한될 수 있습니다.
                      <ul>
                        <li>
                          변호사 선임 및 변호사 선임 비용 관련 질문, 사적 질문
                        </li>
                        <li>
                          법률 문제 해결을 목적으로 하는 의뢰 사항이 아닌 경우
                        </li>
                        <li>
                          동일/유사한 내용의 의뢰 요청을 지속적으로 반복할 경우
                        </li>
                        <li>
                          동일/유사한 내용의 게시물을 지속적으로 반복 게재
                        </li>
                        <li>의미없는 문자의 나열 포함</li>
                      </ul>
                    </li>
                  </StyledList>
                  <Checkbox
                    onChange={handleCheckboxChange}
                    style={{ color: "#999" }}
                  >
                    안내 사항을 모두 확인했으며, 동의합니다.
                  </Checkbox>
                </div>
              </div>
              <div className="mt-10 w-full h-[58px] px-5 py-4 bg-blue-500 bg-opacity-10 rounded-md justify-between items-center inline-flex">
                <div className="text-blue-500 text-base font-semibold font-['Pretendard'] leading-tight">
                  총 결제 금액
                </div>
                <div className="justify-start items-center gap-0.5 flex">
                  <div className="text-right text-blue-500 text-[22px] font-bold font-['Pretendard']">
                    120,000
                  </div>
                  <div className="text-right text-blue-500 text-base font-semibold font-['Pretendard'] leading-tight">
                    원
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[77px] ml-10 right-side">
            <Form.Item className="mb-8">
              <p>의뢰 제목</p>
              <Input
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
                placeholder="제목을 입력하세요"
              />
            </Form.Item>
            <Form.Item>
              <p>
                의뢰 내용<span>(100자 이상)</span>
              </p>
              <Editor
                toolbarItems={[
                  ["heading", "bold", "italic", "strike"],
                  ["hr", "quote"],
                  ["ul", "ol", "task", "indent", "outdent"],
                  ["table", "link"],
                ]}
                height="500px"
                initialEditType="wysiwyg"
                ref={editorRef}
                hideModeSwitch={true}
                language="ko-KR"
                initialValue="내용을 입력하세요"
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="mt-[40px] w-[150px]"
                type="primary"
                htmlType="submit"
                disabled={!isCheckboxChecked}
              >
                의뢰 요청하기
              </Button>
            </Form.Item>
          </div>
        </Form>
        <Modal
          title="제출 확인"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
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
