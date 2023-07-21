import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import {
  GetAllDonarsOfAnOrganization,
  getAllHospitalsOfAnOrganization,
} from "../../../apicalls/users";
import { Button, Table, message } from "antd";
import { getDateFormat } from "../../../utils/helpers";

function Hospitals() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const getData = async (req, res) => {
    dispatch(SetLoading(true));
    const response = await getAllHospitalsOfAnOrganization();
    dispatch(SetLoading(false));
    if (response.success) {
      setData(response.data);
    } else {
      throw new Error(response.message);
    }
    try {
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Hospital Name",
      dataIndex: "hospitalName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default Hospitals;
