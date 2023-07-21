import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import {
  getAllOrganizationsOfDonar,
  getAllOrganizationsOfHospital,
} from "../../../apicalls/users";
import { Modal, Table, message } from "antd";
import { getDateFormat } from "../../../utils/helpers";
import InventoryTable from "../../../components/InventoryTable";

function Organizations({ userType }) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { currentUser } = useSelector((state) => {
    // console.log(state.users);
    return state.users;
  });
  const [selectedOrganization, setSelectedOrganization] = useState();
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      let response = {};
      if (userType === "hospital") {
        response = await getAllOrganizationsOfHospital();
      } else {
        response = await getAllOrganizationsOfDonar();
      }
      dispatch(SetLoading(false));
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
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
      title: "Name",
      dataIndex: "organizationName",
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
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <span
            className="underline text-md cursor-pointer"
            onClick={() => {
              console.log(record);
              setSelectedOrganization(record);
              setShowHistoryModal(true);
            }}
          >
            History
          </span>
        );
      },
    },
  ];

  // In the provided code, the record object does not directly have access to the database. Instead, it represents a single row of data in the data array, which is passed as the dataSource to the Ant Design Table component.
  // The data array is populated by the response.data received from the API call in the getData function. The response.data contains the organization data fetched from the database through the getAllOrganizationsOfDonar or getAllOrganizationsOfHospital API calls.
  // Each object in the data array represents a single organization with its corresponding properties, such as organizationName, email, phone, and createdAt. The Table component iterates over the data array and renders each object in a row.
  // When the render function is called for the "Action" column, the record parameter represents the current row being rendered. It contains the data for that particular organization, which includes the values of organizationName, email, phone, and createdAt.

  return (
    <div>
      <Table columns={columns} dataSource={data} />
      {showHistoryModal && (
        <>
          <Modal
            title={`${
              userType === "donar" ? "Donation History" : "Consumption History"
            } In ${selectedOrganization.organizationName}`}
            centered
            open={showHistoryModal}
            onCancel={() => setShowHistoryModal(false)}
            width={1000}
          >
            <InventoryTable
              filters={{
                organization: selectedOrganization._id,
                [userType]: currentUser._id,
              }}
            />
          </Modal>
        </>
      )}
    </div>
  );
}

export default Organizations;
