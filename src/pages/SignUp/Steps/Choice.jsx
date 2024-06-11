import React, { useState } from "react";
import Logo from "assets/images/icons/Logo.svg";
import styled from "styled-components";
import { Checkbox, Form, Button } from "antd";
import Contract from "assets/images/icons/contract.svg";
import Agree from "assets/images/icons/agree.svg";
import Person from "assets/images/icons/person.svg";
import LawCheck from "assets/images/icons/lawCheck.svg";
import Show from "assets/images/icons/show.svg";
import Fight from "assets/images/icons/fight.svg";
import LawQuestion from "assets/images/icons/lawQuestion.svg";
import Document from "assets/images/icons/document.svg";

const Choice = ({ handleData, handleSubmit }) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [form] = Form.useForm();

  const onChange = checkedValues => {
    console.log("checkedValues:", checkedValues);
    setSelectedValues(checkedValues);
  };

  const radioOptions = [
    { value: "1", text: "계약서 검토/작성", img: Contract },
    { value: "2", text: "약관 검토/작성", img: Agree },
    { value: "3", text: "개인정보 처리방침\n검토 / 작성", img: Person },
    { value: "4", text: "법률 검토\n의견서 작성", img: LawCheck },
    { value: "5", text: "내용 증명 작성", img: Show },
    { value: "6", text: "분쟁 해결 자문", img: Fight },
    { value: "7", text: "법률 검토 질의", img: LawQuestion },
    { value: "8", text: "등기", img: Document },
  ];

  const onFinish = values => {
    const caseCategoryKeyList = selectedValues.map(Number); // String을 Number로 변환
    const data = {
      ...values,
      caseCategoryKeyList,
    };
    console.log("결과값: ", data);
    handleData(data);
    handleSubmit();
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center">
      <div className="relative w-[600px] mb-[100px]  mx-auto px-6">
        <div className="w-full relative  mt-[20px]">
          <div className="mb-6">
            <img src={Logo} alt="" className="mx-auto w-[226px]" />
            <h1 className="text-center text-lg text-gray-400 font-medium mt-4 pb-[20px]">담당 의뢰 분야 선택</h1>
          </div>
          <Form form={form} onFinish={onFinish}>
            <Form.Item name="caseCategoryKeyList">
              <StyledCheckGroup onChange={onChange} className="grid grid-cols-4 gap-x-6 gap-y-5 text-center">
                {radioOptions.map(option => (
                  <Checkbox key={option.value} value={option.value}>
                    <div className="check-img-wrapper">
                      <img src={option.img} alt={option.text} />
                    </div>
                    <p>{option.text}</p>
                  </Checkbox>
                ))}
              </StyledCheckGroup>
            </Form.Item>
            <Button type="primary" htmlType="submit" block className="mt-8">
              가입 신청
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Choice;

const StyledCheckGroup = styled(Checkbox.Group)`
  label {
    height: max-content;
    line-height: initial;
    display: block;
    .ant-checkbox {
      display: none;
    }

    /* 체크박스가 체크되었을 때 테두리 색상 변경 */
    .ant-checkbox-checked + span .check-img-wrapper {
      border-radius: 16px;
      border: 3px solid var(--Design-Token-Text-SIM-Blue, #2e7ff8);
      background: var(--White, #fff);
      box-shadow: 0px 1px 16px 0px rgba(46, 127, 248, 0.16);
    }
    .check-img-wrapper {
      border-radius: 16px;
      border: 1px solid #f2f4f8;
      background: var(--White, #fff);
      box-shadow: 0px 1px 8px 0px rgba(228, 233, 241, 0.6);
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      height: 120px;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
      }
    }
    .check-img-wrapper + p {
      margin-top: 12px;
      color: #272c3b;
      text-align: center;
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      line-height: 18px; /* 120% */
      letter-spacing: -0.3px;
      white-space: pre-wrap;
    }
    .ant-checkbox-wrapper:after {
      display: none;
    }
    .ant-checkbox + span {
      padding: 0 !important;
    }
  }
`;
