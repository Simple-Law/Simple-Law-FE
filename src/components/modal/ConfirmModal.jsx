import PropTypes from "prop-types";
import { Modal } from "antd";

const ConfirmModal = ({ title, visible, onOk, onCancel, children }) => (
  <Modal title={title} open={visible} onOk={onOk} onCancel={onCancel}>
    {children}
  </Modal>
);

ConfirmModal.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default ConfirmModal;
