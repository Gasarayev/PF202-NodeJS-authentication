const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");


// generateJWTtoken funksiyası nə edir?
// 1. Gələn payload məlumatını JWT_SECRET ilə imzalayır.
// 2. İstifadəçi məlumatlarını və tokenin müddətini (expiresIn) qəbul edir.
// 3. Tokeni yaradır və geri qaytarır.
// 4. Bu funksiya, istifadəçi autentifikasiyasını təmin etmək üçün istifadə olunur.

const generateJWTtoken = (payload, expiresIn = "1h") => {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn
    });
    return token;
};

// verifyJWTtoken funksiyası nə edir?
// 1. Gələn tokeni JWT_SECRET ilə yoxlayır.
// 2. Əgər token etibarsızdırsa, xəta atır.
// 3. Əgər token etibarlıdırsa, deşifrə edir və geri qaytarır.
// 4. Bu funksiya, istifadəçi autentifikasiyasını təmin etmək üçün istifadə olunur.

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
