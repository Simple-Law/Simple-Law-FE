import { Button, Form } from "antd";
import React, { useState, useEffect } from "react";

const SubmitButton = ({ form, children }) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  console.log(values);
  console.log("submittable:", submittable);
  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  return (
    <Button type="primary" htmlType="submit" disabled={!submittable} block>
      {children}
    </Button>
  );
};
export default SubmitButton;
