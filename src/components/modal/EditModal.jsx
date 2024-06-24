import React, { useState } from "react";
import { Button, Modal } from "antd";
import PropTypes from "prop-types";

const EditModal = (child, modalTitle) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type='primary' onClick={showModal}>
        {modalTitle}
      </Button>
      <Modal title='Basic Modal' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {child}
      </Modal>
    </>
  );
};

PropTypes.EditModal = {
  child: PropTypes.node.isRequired,
  modalTitle: PropTypes.string.isRequired,
};

export default EditModal;
