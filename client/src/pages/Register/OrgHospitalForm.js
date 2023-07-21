import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { getAntdInputValidation } from "../../utils/helpers";

function OrgHospitalForm({ type }) {
  return (
    <>
      <Form.Item
        label={type === "hospital" ? "Hospital Name" : "Organization Name"}
        name={type === "hospital" ? "hospitalName" : "organizationName"}
        rules={getAntdInputValidation(
          type === "hospital" ? "hospital name" : "organization name"
        )}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="owner"
        label="Owner"
        rules={getAntdInputValidation("owner name")}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={getAntdInputValidation("email")}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone"
        rules={getAntdInputValidation("contact number")}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="website"
        label="Website"
        rules={getAntdInputValidation("website url")}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        className="col-span-2"
        rules={getAntdInputValidation("address")}
      >
        <TextArea />
      </Form.Item>
    </>
  );
}

export default OrgHospitalForm;
