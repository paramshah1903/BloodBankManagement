const router = require("express").Router();
const Inventory = require("../models/inventoryModel");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const mongoose = require("mongoose");

router.post("/add", authMiddleware, async (req, res) => {
  try {
    //validate email and inventory type
    // console.log(req.body);
    //the userId is present in the inventory data req.body as we used the authMiddleware which inserts in the req.body
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("Invalid Email");
    }

    if (req.body.inventoryType === "in" && user.userType !== "donar") {
      throw new Error("This email is not registered as a donar");
    }

    if (req.body.inventoryType === "out" && user.userType !== "hospital") {
      throw new Error("This email is not registered as a hospital");
    }

    if (req.body.inventoryType === "out") {
      //check if inventory is available
      const requestedGroup = req.body.bloodGroup;
      const requestQuantity = req.body.quantity;
      const organization = new mongoose.Types.ObjectId(req.body.userId);

      // const organization = new mongoose.Types.ObjectId(req.body.userId);: This line creates a new ObjectId instance using the value of the "userId" field from the request body. The ObjectId is used to represent the organization that the inventory belongs to.
      // const totalInOfRequestedGroup = await Inventory.aggregate([...]);: This line performs the aggregation query on the "Inventory" collection using the aggregate() method. It awaits the result of the aggregation operation and assigns it to the variable totalInOfRequestedGroup.
      // $match stage: This stage is used to filter the documents in the collection based on certain criteria. In this case, it filters for documents that match the specified organization, have an inventoryType of "in", and the bloodGroup matches the requestedGroup.
      // $group stage: This stage groups the filtered documents based on the "bloodGroup" field. It calculates the total quantity within each group using the $sum operator, and the result is assigned to the "total" field in the resulting documents.

      const totalInOfRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organization,
            inventoryType: "in",
            bloodGroup: requestedGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      console.log(totalInOfRequestedGroup);
      // totalInOfRequestedGroup it return an array of objects with id and total properties
      const totalIn = totalInOfRequestedGroup[0]?.total || 0;
      console.log(totalIn);
      if (totalIn === 0) {
        throw new Error(
          `The requested blood group ${requestedGroup.toUpperCase()} is not available at the moment!`
        );
      }

      const totalOutOfRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organization,
            inventoryType: "out",
            bloodGroup: requestedGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      // if (totalOutOfRequestedGroup.length === 0) {
      //   throw new Error(
      //     `The requested blood group (${requestedGroup.toUpperCase()}) is not available at the moment`
      //   );
      // }

      const totalOut = totalOutOfRequestedGroup[0]?.total || 0;

      const availableQuantityOfRequestedGroup = totalIn - totalOut;
      if (availableQuantityOfRequestedGroup < requestQuantity) {
        throw new Error(
          `Only ${availableQuantityOfRequestedGroup} units of ${requestedGroup.toUpperCase()} are available`
        );
      }

      req.body.hospital = user._id;
    } else {
      req.body.donar = user._id;
    }

    //add inventory
    const inventory = new Inventory(req.body);
    await inventory.save();

    return res.send({
      success: true,
      message: "Inventory added successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// The authMiddleware function receives the req, res, and next parameters, representing the incoming request, the response, and the next middleware function in the chain.
// In the authMiddleware function, the JWT token is extracted from the "authorization" header of the request using req.header("authorization"). The "authorization" header typically contains the JWT sent by the client for authentication.
// The extracted token string is then processed and decrypted using jwt.verify(token, process.env.jwt_secret). The jwt.verify() function verifies the token's authenticity and decodes its payload.
// If the token is valid and successfully verified, the decoded payload is obtained, which is stored in decryptedData. In this case, decryptedData is expected to have a userId property.
// The userId from decryptedData is assigned to req.body.userId. This allows subsequent middleware or route handlers to access the user ID conveniently via req.body.userId.
// Therefore, in the GET route handler, req.body.userId would contain the user ID extracted from the JWT token during the authentication process. This ID can be used to query or filter data specific to the authenticated user when fetching the inventory items.

router.get("/get", authMiddleware, async (req, res) => {
  try {
    // console.log(req.body);
    const inventory = await Inventory.find({ organization: req.body.userId })
      .sort({ createdAt: -1 })
      .populate("donar")
      .populate("hospital");

    // In the given code snippet, there are two populate() methods used in the Inventory.find() query. These methods are used to populate referenced documents from other collections in the MongoDB database.
    // The first populate("donar") method is used to populate the donar field in the Inventory model. This field is a reference to the "users" collection in the database. By using populate("donar"), the referenced user document will be retrieved and populated in place of the donar field in the resulting inventory object.
    // The second populate("hospital") method is used to populate the hospital field in the Inventory model. Similar to the previous populate() method, this field is also a reference to the "users" collection. By using populate("hospital"), the referenced user document will be retrieved and populated in place of the hospital field in the resulting inventory object.
    // By populating these fields, you can access the complete user objects instead of just their ObjectIDs when working with the inventory object retrieved from the database. This allows you to access the properties of the referenced user objects without making additional queries to the "users" collection.

    return res.send({
      success: true,
      data: inventory,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/filter", authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find(req.body.filters)
      .sort({
        createdAt: -1,
      })
      .limit(req.body.limit || 10)
      .populate("donar")
      .populate("hospital")
      .populate("organization");

    return res.send({
      success: true,
      message: "Successfully fetched",
      data: inventory,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
