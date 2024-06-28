import { useSelector } from "react-redux";
import { Spin } from "antd";

const LoadingSpinner = () => {
  const loading = useSelector(state => state.loading.loading);

  return loading ? (
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
  ) : null;
};

export default LoadingSpinner;
