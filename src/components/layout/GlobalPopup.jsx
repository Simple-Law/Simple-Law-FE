import { Button, Modal } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * 공통 모달 컴포넌트
 */
const GlobalPopup = ({
  type,
  title,
  openState,
  children,
  okHandler,
  cancelHandler,
  okText = "확인",
  cancelText = "취소",
  width = 400,
  top = 130,
}) => {
  const getContent = () => {
    switch (type) {
      case "alert":
        return (
          <Button className='w-[80px] h-[40px] p-0' type='primary' onClick={okHandler}>
            {okText}
          </Button>
        );

      case "confirm":
        return (
          <>
            <Button className='w-[80px] h-[40px] p-0' onClick={cancelHandler}>
              {cancelText}
            </Button>
            <Button className='w-[80px] h-[40px] p-0' type='primary' onClick={okHandler}>
              {okText}
            </Button>
          </>
        );

      case "custom":
        return <>{children}</>;
    }
  };

  return (
    <StyledModal open={openState} width={width} style={{ top: top }} footer={null} closeIcon={false}>
      <div className='p-[15px]'>
        <p className='text-center font-bold text-[20px]'>{title}</p>
        <div className='flex gap-[30px] justify-center mt-[30px]'>{getContent()}</div>
      </div>
    </StyledModal>
  );
};

GlobalPopup.propTypes = {
  type: PropTypes.oneOf(["alert", "confirm", "custom"]),
  title: PropTypes.string.isRequired,
  openState: PropTypes.bool.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  okHandler: PropTypes.func,
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  width: PropTypes.number,
  top: PropTypes.number,
  children: PropTypes.node,
};

export default GlobalPopup;

const StyledModal = styled(Modal)`
  border-radius: 16px;
  top: 75px;
`;
