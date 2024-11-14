import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, Switch } from "antd";
import Cropper from "react-easy-crop";
import { useFileUpload } from "hooks/useFileUpload";
import ConfirmModal from "components/modal/ConfirmModal";
// import { updateProfileImageApi } from "apis/userApi";

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
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const { handleFileChange } = useFileUpload();

  // 체크박스 상태 관리
  const [isMarketingConsent, setIsMarketingConsent] = useState(user.isMarketingConsent);

  const onToggleMarketingConsent = checked => {
    setIsMarketingConsent(checked);
    console.log(`마케팅 수신 설정: ${checked}`);
    // TODO: DY - 마케팅 수신 동의 상태를 업데이트 API 추가.
  };
  const formatPhoneNumber = phoneNumber => {
    return phoneNumber.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  };

  const formattedPhone = formatPhoneNumber(user.phone);

  const handleProfileClick = () => {
    setIsModalVisible(true);
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
        // await updateProfileImageApi(fileUploadId);
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
            <div>{user.name}</div>
          </div>
          <div className='flex w-[600px] p-4 justify-between items-center border-b border-gray-300'>
            <div className='text-gray-700'>담당 의뢰분야</div>
            <div>{user.name}</div>
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
      <div className='flex w-[600px] p-4 justify-between items-center border-b border-gray-300'>
        <div className='text-gray-700'>휴대폰 번호</div>
        <div>{formattedPhone}</div>
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
    </div>
  );
};

export default MyPage;
