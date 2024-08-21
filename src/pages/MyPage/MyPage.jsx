import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, Switch, Modal } from "antd";
import Cropper from "react-easy-crop";
import { useFileUpload } from "hooks/useFileUpload";
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

  const onChange = checked => {
    console.log(`switch to ${checked}`);
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
  return (
    <div>
      <h2>계정 관리</h2>
      <p>가입 정보</p>
      <div>
        <div style={{ cursor: "pointer", color: "blue" }} onClick={handleProfileClick}>
          프로필
        </div>
      </div>
      <div>이름 {user.name}</div>
      <div>아이디 {user.id}</div>
      {user.type !== "MEMBER" && (
        <div>
          <div>소속 {user.name}</div>
          <div>담당 의뢰분야 {user.name}</div>
        </div>
      )}
      <p>계정</p>
      <div>이메일 {user.email}</div>
      <div>비밀번호 </div>
      <p>SNS로 간편 가입한 경우 비밀번호 없이 로그인이 가능합니다.</p>
      <div>휴대폰 번호 {formattedPhone}</div>
      <p>알림 설정</p>
      <div>
        마케팅 수신 설정 <Switch checked={user.isMarketingConsent} onChange={onChange} />
      </div>
      {user.type !== "MEMBER" && <div>의뢰 안내 설정</div>}
      <Button>회원탈퇴</Button>

      <Modal
        open={isModalVisible}
        onOk={handleFileUpload}
        onCancel={handleCancel}
        okText='이미지 업로드'
        cancelText='취소'
      >
        <div style={{ textAlign: "center" }}>
          {imageSrc ? (
            <>
              <div style={{ position: "relative", height: 400, background: "#333" }}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            </>
          ) : (
            <input type='file' accept='image/*' onChange={handleImageChange} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MyPage;
