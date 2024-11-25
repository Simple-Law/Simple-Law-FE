import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, Switch, Input, Modal, Form } from "antd";
import Cropper from "react-easy-crop";
import { useFileUpload } from "hooks/useFileUpload";
import ConfirmModal from "components/modal/ConfirmModal";
import { useForm, Controller } from "react-hook-form"; // 추가
import { yupResolver } from "@hookform/resolvers/yup"; // 추가
import { userPhoneChangeSchema } from "utils/validations"; // 추가
import { useAuthCode } from "utils/verification"; // 인증 훅 임포트
import { formatPhoneNumber } from "utils/formatters";

export const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      const fileUrl = URL.createObjectURL(blob);
      resolve(fileUrl);
    }, "image/jpeg");
  });
};

export const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", error => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const MyPage = () => {
  const user = useSelector(state => state.auth.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false); // 인증 모달 상태
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showAuthenticationCodeField, setShowAuthenticationCodeField] = useState(false); // 인증 필드 상태 - 수정
  const { handleFileChange } = useFileUpload();

  const formattedPhone = user.phone ? formatPhoneNumber(user.phone) : "";
  // React Hook Form 사용 및 인증 관련 상태 관리
  const {
    control,
    // handleSubmit,
    // formState: { errors, isValid },
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(userPhoneChangeSchema),
    mode: "onBlur",
    defaultValues: {
      phoneNumber: formattedPhone || "",
      verificationCode: "",
    },
  });

  const { handleSendAuthCode, handleVerifyAuthCode, handleAuthCodeChange, formatTime, timer } = useAuthCode(
    watch,
    setShowAuthenticationCodeField, // 수정
    setValue,
    user,
  );

  // 체크박스 상태 관리 함수
  const [isMarketingConsent, setIsMarketingConsent] = useState(user.isMarketingConsent);

  const onToggleMarketingConsent = checked => {
    setIsMarketingConsent(checked);
    console.log(`마케팅 수신 설정: ${checked}`);
    // TODO: DY - 마케팅 수신 동의 상태를 업데이트 API 추가.
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileUpload = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const fileUploadId = await handleFileChange(croppedImage);
      if (fileUploadId) {
        // TODO: DY - 프로필 이미지 업로드 api 필요
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result);
      };
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImageSrc(null);
  };

  const handleDeleteImage = () => {
    setImageSrc(null); // 이미지만 초기화하고 모달은 유지
  };

  // 휴대폰 인증 모달 관리
  const handlePhoneNumberClick = () => {
    setIsAuthModalVisible(true);
  };

  const handleAuthModalCancel = () => {
    setIsAuthModalVisible(false);
  };
  const handlePhoneNumberChange = e => {
    const formattedValue = formatPhoneNumber(e.target.value); // 전화번호 포맷팅 적용
    setValue("phoneNumber", formattedValue);
  };
  const handleSendCode = () => {
    const phoneNumber = watch("phoneNumber");
    const name = user.name;
    if (phoneNumber) {
      handleSendAuthCode(name, phoneNumber);
      console.log(name, phoneNumber);
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = watch("verificationCode");
    const isVerified = await handleVerifyAuthCode(verificationCode);
    if (isVerified) {
      console.log("인증 성공");
      setIsAuthModalVisible(false);
    } else {
      console.log("인증 실패");
    }
  };

  const handleVerificationCodeChange = e => {
    handleAuthCodeChange(e);
  };

  return (
    <div className='w-[600px] mx-auto'>
      <h2 className='text-2xl font-bold leading-10 p-5'>계정 관리</h2>

      <p className='font-semibold text-lg border-b border-gray-300'>가입 정보</p>
      <div className='flex w-[600px] p-4 items-center gap-2 border-b border-gray-300'>
        <div className='text-gray-700'>이름</div>
        <div className='flex-1'>{user.name}</div>
      </div>
      <div className='flex w-[600px] p-4 justify-between items-center border-b border-gray-300'>
        <div className='text-gray-700'>아이디</div>
        <div className='text-gray-900'>{user.id}</div>
      </div>
      {user.type !== "MEMBER" && (
        <>
          <div className='flex w-[600px] p-4 justify-between items-center border-b border-gray-300'>
            <div className='text-gray-700'>소속</div>
            <div>{user.company}</div>
          </div>
          <div className='flex w-[600px] p-4 justify-between items-center border-b border-gray-300'>
            <div className='text-gray-700'>담당 의뢰분야</div>
            <div>{user.specialty}</div>
          </div>
        </>
      )}

      <p className='font-semibold text-lg border-b border-gray-300 mt-4'>계정</p>
      <div className='flex w-[600px] p-4 justify-between items-center border-b border-gray-300'>
        <div className='text-gray-700'>이메일</div>
        <div className='text-gray-900'>{user.email}</div>
      </div>
      <div className='flex w-[600px] p-4 justify-between items-start border-b border-gray-300'>
        <div className='text-gray-700'>비밀번호</div>
        <div>미등록</div>
      </div>
      <p className='text-sm text-gray-500 p-4'>SNS로 간편 가입한 경우 비밀번호 없이 로그인이 가능합니다.</p>

      {/* 휴대폰 번호 클릭 시 인증 모달 열기 */}
      <div
        className='flex w-[600px] p-4 justify-between items-center border-b border-gray-300 cursor-pointer'
        onClick={handlePhoneNumberClick}
      >
        <div className='text-gray-700'>휴대폰 번호</div>
        <div>{watch("phoneNumber")}</div>
      </div>

      <p className='font-semibold text-lg border-b border-gray-300 mt-4'>알림 설정</p>
      <div className='flex w-[600px] p-4 justify-between items-center border-b border-gray-300'>
        <div className='text-gray-700'>마케팅 수신 설정</div>
        <Switch checked={isMarketingConsent} onChange={onToggleMarketingConsent} />
      </div>
      {user.type !== "MEMBER" && (
        <div className='flex w-[600px] p-4 justify-between items-center border-b border-gray-300'>
          <div className='text-gray-700'>의뢰 안내 설정</div>
        </div>
      )}
      <div className='flex justify-center mt-4'>
        <Button>회원탈퇴</Button>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        title='프로필 사진'
        open={isModalVisible}
        onOk={handleFileUpload}
        onCancel={handleCancel}
        footer={[
          <Button key='delete' onClick={handleDeleteImage}>
            삭제
          </Button>,
          <Button key='submit' type='primary' onClick={handleFileUpload}>
            등록하기
          </Button>,
        ]}
      >
        <div className='text-center'>
          {imageSrc ? (
            <div className='relative h-[400px] bg-gray-800'>
              <Cropper
                image={imageSrc}
                crop={crop}
                cropShape='round'
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          ) : (
            <input type='file' accept='image/*' onChange={handleImageChange} />
          )}
        </div>
      </ConfirmModal>

      {/* 인증 모달 */}
      <Modal
        title='휴대폰 인증'
        visible={isAuthModalVisible}
        onCancel={handleAuthModalCancel}
        footer={[
          <Button key='send' type='primary' onClick={handleSendCode}>
            인증 요청
          </Button>,
          <Button key='verify' type='primary' onClick={handleVerifyCode}>
            인증 확인
          </Button>,
        ]}
      >
        <Form layout='vertical'>
          <Form.Item label='휴대전화 번호'>
            <Controller
              name='phoneNumber'
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="휴대전화번호('-' 제외하고 입력)"
                  {...field}
                  maxLength='13'
                  onChange={handlePhoneNumberChange} // 전화번호 포맷팅 적용
                  suffix={
                    <p
                      onClick={handleSendCode}
                      disabled={!watch("phoneNumber")}
                      style={{ color: "#287fff", cursor: "pointer" }}
                    >
                      {showAuthenticationCodeField ? "재전송" : "인증 요청"}
                    </p>
                  }
                />
              )}
            />
            {errors.phoneNumber && <p style={{ color: "red" }}>{errors.phoneNumber.message}</p>}
          </Form.Item>

          {showAuthenticationCodeField && (
            <Form.Item label='인증번호'>
              <Controller
                name='verificationCode'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='인증번호 입력'
                    maxLength={4}
                    onChange={handleVerificationCodeChange}
                    suffix={<span style={{ color: "#287fff" }}>{timer > 0 ? formatTime(timer) : "0:00"}</span>}
                  />
                )}
              />
              {errors.verificationCode && <p style={{ color: "red" }}>{errors.verificationCode.message}</p>}
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default MyPage;
