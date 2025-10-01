const ResponseManager = require("../middleware/ResponseManager");
const { User, Role } = require("../model/userModel"); // call model
const { Business } = require("../model/quotationModel");
const nodemailer = require("nodemailer");

const otpStore = {}; // เก็บ OTP ใน memory (production ควรใช้ DB/Redis)

function generateOtp(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

class LineLiff {
  static async SendOTP(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return ResponseManager.ErrorResponse(req, res, 400, "Email is required");
      }

      // สร้าง OTP
      const otp = generateOtp(6);
      otpStore[email] = { otp, expires: Date.now() + 3 * 60 * 1000 }; // เก็บ 3 นาที

      // ตั้งค่า transporter (ตัวอย่างใช้ Gmail)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "eccerp2568@gmail.com", // TODO: แก้เป็นอีเมลจริง
          pass: "ehpy fnyq ujnt hqxo"     // TODO: ใช้ App password ของ Gmail
        }
      });

      // ส่งอีเมล
      await transporter.sendMail({
        from: '"Business Verification" <your-email@gmail.com>',
        to: email,
        subject: "รหัสยืนยัน OTP",
        text: `รหัส OTP ของคุณคือ ${otp} (หมดอายุภายใน 3 นาที)`,
        html: `<h3>OTP: ${otp}</h3><p>รหัสนี้จะหมดอายุใน 3 นาที</p>`
      });
      return ResponseManager.SuccessResponse(req, res, 200, {
        message: "OTP sent successfully",
        otp: otp, // เอาไว้ debug (จริงๆ ไม่ควรส่งกลับ client)
      });

    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async VerifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
      const record = otpStore[email];

      if (!record) {
        return ResponseManager.ErrorResponse(req, res, 400, "ไม่มี OTP สำหรับอีเมลนี้");
      }
      if (Date.now() > record.expires) {
        return ResponseManager.ErrorResponse(req, res, 400, "OTP หมดอายุ");
      }
      if (record.otp !== otp) {
        return ResponseManager.ErrorResponse(req, res, 400, "OTP ไม่ถูกต้อง");
      }

      delete otpStore[email]; // ใช้แล้วลบ

    return ResponseManager.SuccessResponse(req, res, 200, {
      message: "ยืนยันสำเร็จ"
    });
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

    static async test(req, res) {
    try {
    return ResponseManager.SuccessResponse(req, res, 200, "ssss")
  
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
}

module.exports = LineLiff;
