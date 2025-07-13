const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

const generateJWTtoken = (payload, expiresIn = "1h") => {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn
    });
    return token;
};

const verifyJWTtoken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        console.log("Decoded JWT:", decoded);
        return {
            valid: true,
            payload: decoded
        };
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};


module.exports = {
  generateJWTtoken,
  verifyJWTtoken,
 
};
