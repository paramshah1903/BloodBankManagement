const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    //to encrypt a token we use a sign method while to decrypt the token we use the verify method
    const token = req.header("authorization").replace("Bearer", "").trim();
    // console.log("Token:", token);
    const decryptedData = jwt.verify(token, process.env.jwt_secret);
    // console.log("Decrypted Data:", decryptedData);
    //we had encrypted the user id so on decryption we basically obtain the userId
    req.body.userId = decryptedData.userId;

    // const token = req.header("authorization").replace("Bearer", "");: In this line of code, the authorization header from the HTTP request is extracted. The req object is provided by Express.js and contains information about the incoming HTTP request. The header() method is used to access the value of the authorization header, which typically contains the JWT that the client (frontend) sends to the server (backend) for authentication purposes.
    // The replace("Bearer", "") part is used to remove the word "Bearer" from the beginning of the token string. The JWT standard specifies that the token should be prefixed with the word "Bearer" to indicate its type. For example, a typical authorization header might look like: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...".
    // By removing "Bearer" from the token string, the code extracts only the actual JWT value.
    // const decryptedData = jwt.verify(token, process.env.jwt_secret);: In this line, the extracted JWT string (token) is passed to the jwt.verify() function provided by the jsonwebtoken library. The purpose of jwt.verify() is to validate and decode the JWT.
    // The function takes two arguments:
    // token: The JWT string to be verified and decoded.
    // process.env.jwt_secret: The secret key used to sign the JWT during token creation. This should match the same secret key used when creating the token in the backend.
    // If the token is valid and has not expired, jwt.verify() will return the decoded data (also known as the payload) of the token, which typically contains the information that was included when the token was created. In this case, the payload contains the userId property that was signed and included in the token during user registration or login.
    // req.body.userId = decryptedData.userId;: After successfully verifying and decoding the JWT, the userId property is extracted from the decryptedData and added to the req.body object. This step is usually performed in middleware functions in Express.js to make the userId available to subsequent routes or functions that handle the authenticated requests.
    // By adding the userId to req.body, the backend can now access the user's ID, which is typically used to identify and perform actions specific to that user in the database or throughout the application

    next();
  } catch (error) {
    return res.send({
      success: false,
      message: "Error here",
    });
  }
};
