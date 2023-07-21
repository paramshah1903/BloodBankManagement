const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");

//registering new user:
router.post("/register", async (req, res) => {
  try {
    //checking if user already exists:
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User already exits",
      });
    }

    //hashing the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //saving the user:
    const user = new User(req.body);
    await user.save();

    return res.send({
      success: true,
      message: "Registration successful.",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//logging in a user:
router.post("/login", async (req, res) => {
  try {
    //checking is user already exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found! ",
      });
    }

    if (user.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `User is not recognized as a ${req.body.userType}`,
      });
    }

    //comparing password:from frontend we get the non hashed password while in db we have the hashed password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // compare(): This is a method provided by the bcrypt library. It is used to compare a plain-text (non-hashed) password with a hashed password. The function takes two arguments:
    // a. The first argument (req.body.password): This is the non-hashed password received from the frontend. It is usually obtained from a user input form on the frontend side, such as a login form.
    // b. The second argument (user.password): This is the hashed password stored in the database for the specific user. When the user initially registered or set their password, it was hashed using bcrypt and saved in the database.
    if (!validPassword) {
      return res.send({
        success: false,
        message: "Password not valid",
      });
    }

    //generate token:
    //basically we have encrypted the user Id using jwt token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.jwt_secret,
      { expiresIn: "1d" }
    );

    // jwt.sign(payload, secretOrPrivateKey, [options]): This is the jwt.sign() function provided by the jsonwebtoken library.
    // payload: This is the first argument to jwt.sign(), and it represents the data that will be included in the JWT. It's typically an object containing some user-specific data or any other relevant information that you want to encode in the token. In this case, the payload includes the userId property, which is set to the _id of the user retrieved from the database.
    // secretOrPrivateKey: This is the second argument to jwt.sign(), and it represents the secret key or private key used to sign the token. The JWT is signed using this key to ensure its integrity and authenticity. Only the server should know this secret key, and it should be kept secure to prevent unauthorized parties from creating or modifying tokens.
    // In the provided code, process.env.jwt_secret is used as the secret key. It is fetched from the environment variables, which is a common practice to keep sensitive information like secret keys out of the source code.
    // options: This is an optional argument to jwt.sign() that allows you to specify additional options for the JWT. In this case, { expiresIn: "1d" } sets the expiration time for the token to 1 day (24 hours) after its creation. After this duration, the token will no longer be valid, and the user will need to obtain a new token for authentication.
    // Once the jwt.sign() function is called with the payload, secret key, and options, it generates a JWT string representing the payload. This JWT can then be included in the authorization header of HTTP requests to the server, allowing the server to verify the user's identity and grant access to protected resources or operations based on the information contained in the token.

    return res.send({
      success: true,
      message: "logged in successfully",
      data: token,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//getting the current user:
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    //as we have used an authMiddleware we have access to the userId which was a field which we could use to uniquely identify a user.
    //using the middleware we have got the Id in the req.body
    const user = await User.findOne({ _id: req.body.userId });
    // console.log(user);
    //remove password from user and send it to frontend
    // user.password = undefined;
    return res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Error",
    });
  }
});

//get all unique donars of an organization
router.get("/get-all-donars", authMiddleware, async (req, res) => {
  try {
    //to get all the unique donar ids from the hospital

    //  The $group stage groups the documents based on the specified field, which in this case is the "donar" field.
    // By grouping the documents based on the "donar" field, all documents with the same "donar" value are grouped together.
    // The _id: "$donar" expression assigns the value of the "donar" field as the grouping key in the resulting documents.
    // Since the $group stage groups documents by the "donar" field and there is no $sum or other aggregation operator used to accumulate or modify the values within each group, the resulting output will contain a distinct list of "donar" values.
    // Therefore, the output of this aggregation pipeline will be an array of unique "donar" values from the "Inventory" collection, where the documents have an "inventoryType" of "in" and the "organization" matches the provided "userId".

    // const uniqueDonarIds = await Inventory.aggregate([
    //   {
    //     $match: {
    //       inventoryType: "in",
    //       organization: new mongoose.Types.ObjectId(req.body.userId), //req.body.userId comes from the authMiddleware
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$donar",
    //     },
    //   },
    // ]);

    const uniqueDonarIds = await Inventory.distinct("donar", {
      organization: req.body.userId,
    });

    //  Inventory.distinct("donar", { organization: req.body.userId }): This line invokes the distinct method on the Inventory model. It takes two arguments:
    // "donar": The first argument specifies the field for which you want to retrieve distinct values, in this case, it's the "donar" field.
    // { organization: req.body.userId }: The second argument is an object that specifies the filter criteria. Here, it filters the documents based on the "organization" field, and the value is set to req.body.userId, which suggests that the "organization" field is being compared to the userId received in the request body.

    const donars = await User.find({
      _id: { $in: uniqueDonarIds },
    });
    // _id: { $in: uniqueDonarIds }: This filter condition uses the _id field and the $in operator. The $in operator matches documents where the _id field's value is present in the uniqueDonarIds array.

    console.log(uniqueDonarIds);
    console.log(donars);
    return res.send({
      success: true,
      message: "Donars fetched successfully",
      data: donars,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all hospitals:
router.get("/get-all-hospitals", authMiddleware, async (req, res) => {
  try {
    const uniqueHospitalIds = await Inventory.distinct("hospital", {
      organization: req.body.userId,
    });

    const hospitals = await User.find({
      _id: { $in: uniqueHospitalIds },
    });

    return res.send({
      success: true,
      message: "Hospitals fetched successfully",
      data: hospitals,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all the unique organizations for a donar:
router.get(
  "/get-all-organizations-of-a-donar",
  authMiddleware,
  async (req, res) => {
    try {
      const uniqueOrganizationIds = await Inventory.distinct("organization", {
        donar: req.body.userId,
      });
      // console.log(uniqueOrganizationIds);
      const organizations = await User.find({
        _id: { $in: uniqueOrganizationIds },
      });

      return res.send({
        success: true,
        message: "Organizations fetched successfully",
        data: organizations,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

//get all unique organizations of hospital
router.get(
  "/get-all-organizations-of-a-hospital",
  authMiddleware,
  async (req, res) => {
    try {
      const uniqueOrganizationIds = await Inventory.distinct("organization", {
        hospital: req.body.userId,
      });
      // console.log(uniqueOrganizationIds);
      const organizations = await User.find({
        _id: { $in: uniqueOrganizationIds },
      });

      return res.send({
        success: true,
        message: "Organizations fetched successfully",
        data: organizations,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
