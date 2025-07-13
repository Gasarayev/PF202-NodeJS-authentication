const nodemailer = require("nodemailer");
const { EMAIL_PASS, EMAIL_USER } = require("../config/config");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: EMAIL_USER, 
    pass: EMAIL_PASS, 
  },
});



const sendVerifyEmail = async ({ fullName, email, verifyLink }) => {
  const mailOptions = {
    
    from: EMAIL_USER,
    to: email,
    subject: "Xoş gəlmisiniz!",
    text: `Hörmətli ${fullName}, xoş gəlmisiniz! Bizimlə əlaqə saxladığınız üçün təşəkkür edirik.`,
    html: `
   <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f7fa;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background-color: #fff;
      margin: 0 auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      color: #333;
    }
    h1 {
      color: #4CAF50;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white !important;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Salam, ${fullName}!</h1>
    <p>
      Siz uğurla qeydiyyatdan keçdiniz. Bizimlə olduğunuz üçün çox şadıq!<br>
      Hesabınızı aktivləşdirmək üçün aşağıdakı düyməyə klikləyin:
    </p>
      ${verifyLink}
    <p>
      Əgər siz bu əməliyyatı etməmisinizsə, zəhmət olmasa bu emaili nəzərə almayın.
    </p>
    <div class="footer">
      © 2025 Sənin Şirkət. Bütün hüquqlar qorunur.
    </div>
  </div>
</body>
</html>
    `,
  };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email göndərildi: ${email}`);
    } catch (error) {
        console.error(`Email göndərilmədi: ${error.message}`);
        throw new Error("Email göndərilməsində xəta baş verdi");
    }
};


module.exports = sendVerifyEmail;