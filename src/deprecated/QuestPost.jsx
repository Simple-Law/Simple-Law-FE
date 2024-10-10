import { useEffect, useRef, useState } from "react";
import SvgLogo from "components/Icons/Logo";
import { Form, Select, Checkbox, Spin } from "antd";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addReply, createMail } from "../redux/actions/mailActions";
import CommonForm from "components/editor/ContentEditorForm";
import { useMessageApi } from "components/messaging/MessageProvider";
import { deleteFile, uploadFile } from "apis/commonAPI";
import { getMailById } from "apis/mailsApi";
import ConfirmModal from "components/modal/ConfirmModal";
import { anytimeLabels, categoryLabels } from "utils/statusLabels";

const QuestPost = () => {
  const { id, mode } = useParams();
  const editorRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messageApi = useMessageApi();
  const user = useSelector(state => state.auth.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendingImages, setPendingImages] = useState([]); // 첨부된 이미지 파일 임시 저장
  const [deletedImages, setDeletedImages] = useState([]); // 삭제된 이미지 파일 URL 임시 저장
  const [existingMail, setExistingMail] = useState(null); // 기존 메일 데이터 저장 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      category: "",
      time: "",
      status: "preparing",
      isCheckboxChecked: false,
    },
    onSubmit: async values => {
      await deleteImagesFromServer();
      const imageUrls = await uploadImagesToServer();
      const contentWithImages = editorRef.current
        .getEditor()
        .root.innerHTML.replace(/<img src="data:([^"]*)">/g, (match, p1, offset, string) => {
          const url = imageUrls.shift();
          return `<img src="${url}">`;
        });

      const currentTime = new Date().toISOString();
      const dataToSend = {
        ...values,
        content: contentWithImages,
        status: values.status || "preparing",
        sentAt: currentTime,
        userId: user.id,
        userName: user.name,
        userType: user.type,
      };

      try {
        if (mode === "reply") {
          console.log("dataToSend", dataToSend);
          // await dispatch(addReply(id, dataToSend));
          // messageApi.success("답변이 등록되었습니다!");
        } else {
          await dispatch(createMail(dataToSend));
          messageApi.success("게시글이 등록되었습니다!");
        }
        // formik.resetForm();
        // navigate("/board");
      } catch (error) {
        messageApi.error("작업에 실패했습니다!");
        console.error("Error sending mail:", error);
      }
    },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // 기존 메일 데이터를 가져오는 함수
    const loadMail = async id => {
      if (id) {
        try {
          const mailData = await getMailById(id);
          setExistingMail(mailData);
          formik.setValues({
            ...formik.values,
            category: mailData.category || "",
            time: mailData.time || "",
            status: mailData.status || "preparing",
            isCheckboxChecked: mailData.isCheckboxChecked || false,
          });
        } catch (error) {
          console.error("Error fetching mail:", error);
        } finally {
          setLoading(false); // 로딩 상태 해제
        }
      } else {
        setLoading(false); // ID가 없을 경우에도 로딩 상태 해제
      }
    };
    if (mode === "reply") {
      loadMail(id);
    } else {
      setLoading(false); // "reply" 모드가 아니면 로딩 상태 해제
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [id, mode]);

  const uploadImagesToServer = async () => {
    const imageUrls = [];
    const currentDate = new Date().toISOString().split("T")[0];
    for (const file of pendingImages) {
      const fileUploadId = await uploadToServer(file);
      if (fileUploadId) {
        const fileUrl = `https://prod-simplelaw-api-server-bucket.s3.ap-northeast-2.amazonaws.com/TEMP/${currentDate}/${fileUploadId}.jpg`;
        imageUrls.push(fileUrl);
      }
    }
    return imageUrls;
  };

  const uploadToServer = async file => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await uploadFile(formData);
      const fileUploadId = response?.data?.payload[0]?.fileUploadId;
      messageApi.success(`${file.name} 파일이 성공적으로 업로드되었습니다.`);
      return fileUploadId;
    } catch (error) {
      messageApi.error(`${file.name} 파일 업로드에 실패했습니다.`);
      console.error("Error uploading file:", error);
    }
  };

  const deleteImagesFromServer = async () => {
    for (const url of deletedImages) {
      try {
        await deleteFile(url);
        console.log("Image deleted:", url);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

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
            <Link to='/'>
              <SvgLogo width='140px' height='36px' className='mx-auto' />
            </Link>
          </div>
        </div>
      </div>
      <FormDiv className='w-[1300px] mx-auto mt-[100px] relative'>
        <h2 className='text-2xl font-bold mb-6 absolute top-[40px] left-0'>의뢰 요청서</h2>
        <Form onFinish={handleSubmit} className='flex pt-24'>
          <div className='left-side'>
            {loading ? <Spin /> : <LeftSideContent existingMail={existingMail} formik={formik} />}
          </div>
          <CommonForm
            formik={formik}
            editorRef={editorRef}
            setPendingImages={setPendingImages}
            setDeletedImages={setDeletedImages}
            mode={mode}
          />
        </Form>
        <ConfirmModal title='제출 확인' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <p>진짜로 제출하시겠습니까?</p>
        </ConfirmModal>
      </FormDiv>
    </div>
  );
};

const LeftSideContent = ({ existingMail, formik }) => (
  <div className='w-[400px]'>
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
              name='anytime'
              placeholder='분야 선택'
              onChange={value => formik.setFieldValue("anytime", value)}
              options={anytimeLabels}
            />
          </Form.Item>
          <Form.Item>
            <p>세부 분야 선택</p>
            <Select
              name='category'
              placeholder='세부 분야 선택'
              onChange={value => formik.setFieldValue("category", value)}
              options={categoryLabels}
            />
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
            <StyledList className=' rounded-md bg-slate-100 px-5 py-5 mb-[10px]'>
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
            <div className="text-right text-blue-500 text-base font-semibold font-['Pretendard'] leading-tight">원</div>
          </div>
        </div>
      </>
    )}
  </div>
);

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
    /* height: auto; */
    height: calc(100vh - 100px);
    padding: 97px 0 20px 0;
    overflow-y: auto;
    position: relative; /* 필요에 따라 위치 설정 */
    /* 스크롤바 숨기기 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
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
