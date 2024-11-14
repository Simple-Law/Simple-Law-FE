import { Form, Select, Checkbox } from "antd";
import { StyledList } from "./styles";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchCaseCategories } from "apis/mailsApi";

const LeftSideContent = ({ existingMail, formik }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCaseCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='mr-16'>
      {existingMail ? (
        <div className='text-gray-700 mb-4'>
          <div className='mb-2'>
            <strong>제목:</strong> {existingMail.title}
          </div>
          <div className='mb-2'>
            <strong>카테고리:</strong> {existingMail.category}
          </div>
          <div className='mb-2'>
            <strong>내용:</strong>
            <div dangerouslySetInnerHTML={{ __html: existingMail.content }} />
          </div>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-8'>
            <Form.Item>
              <p>분야 선택</p>
              <Select
                name='categoryKey'
                placeholder='분야 선택'
                onChange={value => formik.setFieldValue("categoryKey", value)}
                options={categories.map(category => ({
                  value: category.caseCategoryKey,
                  label: category.name,
                }))}
              />
            </Form.Item>
            <Form.Item>
              <p>세부분야 선택</p>
              <Select name='categoryDetailKey' placeholder='세부분야 선택' />
              <Select name='addDetailKey' placeholder='추가 선택' />
            </Form.Item>
            <Form.Item>
              <p>의뢰 작업 기한</p>
              <Select name='time' placeholder='의뢰 작업 기한' onChange={value => formik.setFieldValue("time", value)}>
                <Select.Option value='12'>12시간</Select.Option>
                <Select.Option value='24'>24시간</Select.Option>
              </Select>
            </Form.Item>
            <div>
              <p>의뢰 등록 전 안내사항</p>
              <StyledList className='rounded-md bg-slate-100 px-5 py-5 mb-[10px]'>
                <li>
                  요청이 완료된 의뢰는 수정이 불가합니다. 수정을 원하실 경우 기존 의뢰를 종료하신 후 새로운 의뢰서를
                  작성해주세요.
                </li>
                <li>
                  변호사의 배정 전 의뢰 취소를 진행할 경우 전액 환불이 가능하며, 변호사의 배정 이후 의뢰 취소는 불가능
                  합니다.
                </li>
                <li>변호사 배정이 완료된 의뢰는 의뢰가 종료될 때 까지 글 삭제가 불가능 합니다.</li>
                <li>작성된 내용은 배정된 변호사 이외에 누구에게도 공개되지 않습니다.</li>
                <li>
                  아래 사항에 해당할 경우, 서비스 이용이 제한될 수 있습니다.
                  <ul>
                    <li>변호사 선임 및 변호사 선임 비용 관련 질문, 사적 질문</li>
                    <li>법률 문제 해결을 목적으로 하는 의뢰 사항이 아닌 경우</li>
                    <li>동일/유사한 내용의 의뢰 요청을 지속적으로 반복할 경우</li>
                    <li>동일/유사한 내용의 게시물을 지속적으로 반복 게재</li>
                    <li>의미없는 문자의 나열 포함</li>
                  </ul>
                </li>
              </StyledList>
              <Form.Item>
                <Checkbox
                  name='isCheckboxChecked'
                  onChange={formik.handleChange}
                  checked={formik.values.isCheckboxChecked}
                  style={{ color: "#999" }}
                >
                  안내 사항을 모두 확인했으며, 동의합니다.
                </Checkbox>
              </Form.Item>
            </div>
          </div>
          <div className='mt-10 w-full h-[58px] px-5 py-4 bg-blue-500 bg-opacity-10 rounded-md justify-between items-center inline-flex'>
            <div className="text-blue-500 text-base font-semibold font-['Pretendard'] leading-tight">총 결제 금액</div>
            <div className='justify-start items-center gap-0.5 flex'>
              <div className="text-right text-blue-500 text-[22px] font-bold font-['Pretendard']">120,000</div>
              <div className="text-right text-blue-500 text-base font-semibold font-['Pretendard'] leading-tight">
                원
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

LeftSideContent.propTypes = {
  existingMail: PropTypes.shape({
    title: PropTypes.string,
    category: PropTypes.string,
    content: PropTypes.string,
  }),
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    values: PropTypes.shape({
      isCheckboxChecked: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

export default LeftSideContent;
