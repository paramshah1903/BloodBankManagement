import React, { useEffect, useState } from "react";
import { LoginUser } from "../../apicalls/users";
import { Button, Form, Input, message } from "antd";
import { Radio } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getAntdInputValidation } from "../../utils/helpers";
// import OrgHospitalForm from "./OrgHospitalForm";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [type, setType] = useState("donar");
  function onChange(e) {
    setType(e.target.value);
  }
  const onFinish = async (values) => {
    // console.log(values);
    try {
      dispatch(SetLoading(true));
      const response = await LoginUser(values);
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        navigate("/");
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
        className="bg-white rounded shadow grid  p-5 gap-5 w-1/3"
        onFinish={onFinish}
      >
        <h1 className=" uppercase text-3xl">
          <span>{type.toUpperCase()} Login</span>
          <hr />
        </h1>
        <Radio.Group onChange={onChange} value={type} className="">
          <Radio value="donar">Donar</Radio>
          <Radio value="hospital">Hospital</Radio>
          <Radio value="organization">Organization</Radio>
        </Radio.Group>

        <>
          <Form.Item
            label="Email"
            name="email"
            rules={getAntdInputValidation("email")}
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

        <Button type="primary" block className="" htmlType="submit">
          Login
        </Button>
        <Link className=" text-center" to="/register">
          Don't have an Account? Register
        </Link>
      </Form>
    </div>
  );
}
