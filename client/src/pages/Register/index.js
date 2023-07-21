import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { Radio } from "antd";
// import { Link } from "react-router-dom";
import OrgHospitalForm from "./OrgHospitalForm";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getAntdInputValidation } from "../../utils/helpers";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [type, setType] = useState("donar");
  function onChange(e) {
    setType(e.target.value);
  }
  const onFinish = async (values) => {
    // Axios is a popular JavaScript library used for making HTTP requests from the frontend (client-side) of a web application. It allows you to send asynchronous HTTP requests to interact with APIs and servers.
    //RegisterUser in turn makes a call to AxiosInstance and the user gets registered
    try {
      dispatch(SetLoading(true));
      const response = await RegisterUser({
        ...values,
        userType: type,
      });
      dispatch(SetLoading(false));
      navigate("/login");
      if (response.success) {
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex h-screen bg-primary items-center justify-center">
      <Form
        layout="vertical"
        className="bg-white rounded shadow grid grid-cols-2 p-5 gap-5 w-1/2"
        onFinish={onFinish}
      >
        <h1 className="col-span-2 uppercase text-3xl">
          <span>{type.toUpperCase()} Registration</span>
          <hr />
        </h1>
        <Radio.Group onChange={onChange} value={type} className="col-span-2">
          <Radio value="donar">Donar</Radio>
          <Radio value="hospital">Hospital</Radio>
          <Radio value="organization">Organization</Radio>
        </Radio.Group>
        {type === "donar" && (
          <>
            <Form.Item
              label="Name"
              name="name"
              rules={getAntdInputValidation("name")}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={getAntdInputValidation("email")}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={getAntdInputValidation("contact number")}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}

        {type !== "donar" && <OrgHospitalForm type={type} />}

        <Button
          type="primary"
          block
          className="col-span-2"
          classNames="bg-primary"
          htmlType="submit"
        >
          Register
        </Button>
        <Link className="col-span-2 text-center" to="/login">
          Already Have an Account? Login
        </Link>
      </Form>
    </div>
  );
}
