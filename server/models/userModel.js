const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
      enum: ["donar", "organization", "hospital", "admin"],
    },
    //name is required only if user type is donar or admin
    //the 'this' keyword refers to the document that is being created or updated. It allows you to access the properties of the document, such as userType, to make dynamic decisions.

    name: {
      type: String,
      required: function () {
        if (this.userType === "admin" || this.userType === "donar") {
          return true;
        }
        return false;
      },
    },
    //hospital name is required for only hospitals
    hospitalName: {
      type: String,
      required: function () {
        if (this.userType === "hospital") {
          return true;
        }
        return false;
      },
    },
    //   ..organization name is req only for organization
    organizationName: {
      type: String,
      required: function () {
        if (this.userType === "organization") {
          return true;
        }
        return false;
      },
    },
    //website and address required by both hospitals and organizations
    website: {
      type: String,
      required: function () {
        if (this.userType === "hospital" || this.userType === "organization") {
          return true;
        }
        return false;
      },
    },
    address: {
      type: String,
      required: function () {
        if (this.userType === "hospital" || this.userType === "organization") {
          return true;
        }
        return false;
      },
    },
    //email,phone and password common for all
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);

// model(): This is a static method provided by Mongoose to create a model. It takes two arguments:
// a. The first argument is the name of the collection that the model represents. In this case, the collection name is "users." Mongoose will automatically convert this to lowercase and pluralize it, resulting in the actual collection name in the database, which would be "users" (lowercase and pluralized).
// b. The second argument is the schema that defines the structure and validation rules for the documents in the collection. In this case, the userSchema schema is passed as the second argument.
