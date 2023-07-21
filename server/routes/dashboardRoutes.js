const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");

//getting all blood groups totalIn,totalOut available data from inventory
router.get("/blood-groups-data", authMiddleware, async (req, res) => {
  try {
    const allBloodGroups = ["a+", "a-", "b+", "b-", "o+", "o-", "ab+", "ab-"];
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const bloodGroupData = [];
    await Promise.all(
      allBloodGroups.map(async (bloodGroup) => {
        const totalIn = await Inventory.aggregate([
          {
            $match: {
              inventoryType: "in",
              organization,
              bloodGroup,
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$quantity",
              },
            },
          },
        ]);

        const totalOut = await Inventory.aggregate([
          {
            $match: {
              inventoryType: "out",
              organization,
              bloodGroup,
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$quantity",
              },
            },
          },
        ]);

        // In the provided code, Promise.all is used to execute multiple asynchronous operations in parallel for each bloodGroup in the allBloodGroups array. It maps over each bloodGroup and creates a new promise for each iteration. The async keyword is used to define an asynchronous function for each iteration of the map method.
        // The await keyword is used twice in this code snippet. The first await is used within the map method to wait for the completion of each promise returned by the Inventory.aggregate method. It ensures that the next iteration of the loop doesn't start until the current promise is resolved.
        // The second await is used inside the async function to wait for the completion of the Promise.all method itself. This is done to ensure that the outer code doesn't proceed until all the asynchronous operations initiated by the map method are completed.

        // Process totalIn and totalOut as needed

        const available = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

        bloodGroupData.push({
          bloodGroup,
          totalIn: totalIn[0]?.total || 0,
          totalOut: totalOut[0]?.total || 0,
          available,
        });

        // console.log(totalIn);
        // console.log(totalOut);
      })
    );

    return res.send({
      success: true,
      message: "Blood groups data",
      data: bloodGroupData,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
