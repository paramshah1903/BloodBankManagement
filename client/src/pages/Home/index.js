import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { GetAllBloodGroupsInventory } from "../../apicalls/dashboard";
import { message } from "antd";
import { getLoggedInUserName } from "../../utils/helpers";
import InventoryTable from "../../components/InventoryTable";

export default function Home() {
  const [bloodGroupsData, setBloodGroupsData] = useState([]);
  const { currentUser } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllBloodGroupsInventory();
      dispatch(SetLoading(false));
      if (response.success) {
        setBloodGroupsData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // throw new Error(error.message);
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(bloodGroupsData);

  const colours = [
    "#2B3467",
    "#1A5F7A",
    "#B8621B",
    "#245953",
    "#2C3333",
    "#804674",
    "#A84448",
    "#635985",
  ];

  return (
    <>
      {currentUser.userType === "organization" && (
        <>
          <div className="grid grid-cols-4 gap-5 mt-6">
            {bloodGroupsData.map((bloodGroup, index) => {
              const colour = colours[index];
              return (
                <div
                  className={` p-5 flex justify-between text-white rounded-md items-center`}
                  style={{ backgroundColor: colour }}
                >
                  <h1 className="uppercase text-6xl">
                    {bloodGroup.bloodGroup}
                  </h1>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between gap-5">
                      <span>Total In:</span>
                      <span>{bloodGroup.totalIn}ml</span>
                    </div>
                    <div className="flex justify-between gap-5">
                      <span>Total Out:</span>
                      <span>{bloodGroup.totalOut}ml</span>
                    </div>
                    <div className="flex justify-between gap-5">
                      <span>Available:</span>
                      <span>{bloodGroup.available}ml</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <h2 className="mt-8 mb-4">Your Recent History:</h2>
          <InventoryTable
            filters={{
              organization: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </>
      )}
      {currentUser.userType === "donar" && (
        <>
          <h2 className="mt-4 mb-4">Your Recent Donation History:</h2>
          <InventoryTable
            filters={{
              donar: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </>
      )}
      {currentUser.userType === "hospital" && (
        <>
          <h2 className="mt-4 mb-4">Your Recent Consumption History:</h2>
          <InventoryTable
            filters={{
              hospital: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </>
      )}
    </>
  );
}
