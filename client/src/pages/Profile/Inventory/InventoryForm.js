import { Form, Input, Modal, Radio, message } from "antd";
import React, { useState } from "react";
import { getAntdInputValidation } from "../../../utils/helpers";
import { useForm } from "antd/es/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { AddInventory } from "../../../apicalls/inventory";

export default function InventoryForm({ open, setOpen, reloadData }) {
  const [form] = useForm();
  const [inventoryType, setInventoryType] = useState("in");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    // console.log(values);
    try {
      dispatch(SetLoading(true));
      const response = await AddInventory({
        ...values,
        inventoryType,
        organization: currentUser._id,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        reloadData();
        message.success("Inventory added successfully");
        setOpen(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };
  return (
    <Modal
      title="ADD INVENTORY"
      open={open}
      onCancel={() => setOpen(false)}
      centered
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        layout="vertical"
        className="flex flex-col gap-3"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="Inventory Type">
          <Radio.Group
            value={inventoryType}
            onChange={(e) => setInventoryType(e.target.value)}
          >
            <Radio value="in">In</Radio>
            <Radio value="out">Out</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Blood Group"
          name="bloodGroup"
          rules={getAntdInputValidation("blood group")}
        >
          <select>
            <option value="a+">A+</option>
            <option value="a-">A-</option>
            <option value="b+">B+</option>
            <option value="b-">B-</option>
            <option value="ab+">AB+</option>
            <option value="ab-">AB-</option>
            <option value="o+">O+</option>
            <option value="o-">O-</option>
          </select>
        </Form.Item>
        <Form.Item
          name="email"
          label={inventoryType === "in" ? "Donar Email" : "Hospital Email"}
          rules={getAntdInputValidation("email")}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Quantity(ml)"
          name="quantity"
          rules={getAntdInputValidation("quantity")}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
