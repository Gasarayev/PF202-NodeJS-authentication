const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

// authMiddleware funksiyası nə edir? 
// 1. Gələn requestin authorization headerini yoxlayır.
// 2. Əgər header yoxdursa və ya Bearer ilə başlamırsa, 401 status kodu ilə cavab qaytarır.
// 3. Əgər header varsa, tokeni alır və onu JWT_SECRET ilə yoxlayır.
// 4. Əgər token etibarsızdırsa, 401 status kodu ilə cavab qaytarır.
// 5. Əgər token etibarlıdırsa, tokenin içindəki məlumatları request obyektinə əlavə edir və növbəti middleware-ə keçid edir.
// 6. Əgər hər hansı bir xəta baş verərsə, 401 status kodu ilə "Token etibarsızdır!" mesajı ilə cavab qaytarır.
// 7. Bu middleware, istifadəçi autentifikasiyasını təmin etmək üçün istifadə olunur

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tapılmadı!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // tokenin içindəki məlumatları requestə əlavə et
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token etibarsızdır!" });
  }
};


module.exports = authMiddleware;
