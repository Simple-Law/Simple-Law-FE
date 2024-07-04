import { useSelector } from "react-redux";
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

export default LoadingSpinner;
