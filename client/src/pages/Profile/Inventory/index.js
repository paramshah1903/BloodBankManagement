import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import InventoryForm from "./InventoryForm";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { GetInventory } from "../../../apicalls/inventory";
import { getDateFormat } from "../../../utils/helpers";

function Inventory() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text) => text + " ml",
    },

    {
      title: "Reference",
      dataIndex: "reference",
      render: (text, record) => {
        console.log(record);
        if (record.inventoryType === "in") {
          return record.donar.name;
        } else {
          return record.hospital.hospitalName;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];
  const getData = async (req, res) => {
    dispatch(SetLoading(true));
    const response = await GetInventory();
    // console.log(response.data);
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
  return (
    <div>
      <div className="flex justify-end">
        <Button type="default" onClick={() => setOpen(true)}>
          Add Inventory
        </Button>
      </div>
      {open && (
        <InventoryForm open={open} setOpen={setOpen} reloadData={getData} />
      )}
      <Table columns={columns} dataSource={data} className="mt-3" />
    </div>
  );
}

export default Inventory;
