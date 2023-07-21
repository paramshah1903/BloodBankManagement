import { useDispatch } from "react-redux";
import { getDateFormat } from "../utils/helpers";
import { SetLoading } from "../redux/loadersSlice";
import { GetInventoryWithFilters } from "../apicalls/inventory";
import { Table, message } from "antd";
import { useEffect, useState } from "react";

function InventoryTable({ filters, userType, limit }) {
  //   const [open, setOpen] = useState(false);
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
        if (userType === "organization") {
          return record.inventoryType === "in"
            ? record.donar.name
            : record.hospital.hospitalName;
        } else {
          return record.organization.organizationName;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  //changing column for hospital:
  if (userType === "hospital") {
    //remove inventory type column:
    columns.splice(0, 1);

    //change reference column to organization name:
    columns[2].title = "Organization Name";

    //Date column should be renamed as Consumed date:
    columns[3].title = "Consumption Date";
  }
  //changing column for donars:
  if (userType === "donar") {
    //remove inventory type column:
    columns.splice(0, 1);

    //change reference column to organization name:
    columns[2].title = "Organization Name";

    //Date column should be renamed as Consumed date:
    columns[3].title = "Donation Date";
  }

  const getData = async (req, res) => {
    dispatch(SetLoading(true));
    const response = await GetInventoryWithFilters(filters, limit);
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
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default InventoryTable;
