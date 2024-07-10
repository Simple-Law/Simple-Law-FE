import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Spin, Skeleton } from "antd";

const LoadingSpinner = () => {
  const userLoading = useSelector(state => state.loading.userLoading);
  const mailLoading = useSelector(state => state.loading.mailLoading);

  if (userLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  if (mailLoading) {
    return (
      <div>
        {[...Array(10)].map((_, index) => (
          <div key={index} className='mb-2'>
            <Skeleton active />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

/**
 * 공통 skeleton loading 컴포넌트
 */
export const SkeletonLoading = ({ type = "", size = "default", length = 10 }) => {
  const getType = () => {
    switch (type) {
      case "input":
        return <Skeleton.Input active block size={size} />;
      case "avatar":
        return <Skeleton.Avatar active size={size} />;
      case "image":
        return <Skeleton.Image active size={size} />;
      default:
        return <Skeleton active size={size} />;
    }
  };

  return (
    <div>
      {[...Array(length)].map((_, index) => (
        <div key={index} className='mb-2'>
          {getType()}
        </div>
      ))}
    </div>
  );
};

SkeletonLoading.propTypes = {
  type: PropTypes.oneOf(["input", "avatar", "image"]),
  size: PropTypes.oneOf(["large", "small", "default"]),
  length: PropTypes.number,
};

export default LoadingSpinner;
