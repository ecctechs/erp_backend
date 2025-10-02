const ResponseManager = require("../middleware/ResponseManager");
const nodemailer = require("nodemailer");
const { User } = require("../model/userModel"); // call model
const otpStore = {}; // เก็บ OTP ใน memory (production ควรใช้ DB/Redis)

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);


// ฟังก์ชันสร้าง OTP
function generateOtp(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

// สร้าง transporter เชื่อมกับ SMTP ของ Chiyo
const transporter = nodemailer.createTransport({
  host: "mail.eccsolutions.co.th",   // แก้ให้ตรงกับของ Host Chiyo
  port: 587,                         // ถ้าใช้ TLS เปลี่ยนเป็น 587
  secure: false,                      // true = SSL (465), false = TLS (587)
  auth: {
    user: "techs@eccsolutions.co.th", // อีเมลที่สร้างใน Chiyo
    pass: "T4ch@ECC!solutions",         // รหัสผ่านอีเมล
  },
  tls: {
    rejectUnauthorized: false, // ⚠️ ข้ามการตรวจสอบ SSL (ไม่ปลอดภัย)
  },
});

class LineLiff {
  // ฟังก์ชันส่ง OTP
  static async SendOTP(req, res) {
    try {
      const { email, name = "User" } = req.body;
      if (!email) {
        return ResponseManager.ErrorResponse(req, res, 400, "Email is required");
      }

      // สร้าง OTP
      const otp = generateOtp(6);
      otpStore[email] = { otp, expires: Date.now() + 3 * 60 * 1000 };

      // ส่งอีเมล
      await transporter.sendMail({
        from: '"ECC Solutions" <no-reply@eccsolutions.co.th>', // อีเมลผู้ส่ง
        to: email,                                             // อีเมลผู้รับ
        subject: "OTP Verification",
        html: `
          <div style="font-family:Arial,sans-serif; padding:20px;">
            <h2>สวัสดีคุณ ${name},</h2>
            <p>รหัส OTP ของคุณคือ:</p>
            <h1 style="color:#2c3e50;">${otp}</h1>
            <p>รหัสนี้จะหมดอายุใน 3 นาที</p>
          </div>
        `,
      });

      return ResponseManager.SuccessResponse(req, res, 200, {
        message: "OTP sent successfully",
      });
    } catch (err) {
      console.error("Error sending email:", err);
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  // ฟังก์ชันตรวจสอบ OTP
  static async VerifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
      const record = otpStore[email];

      if (!record)
        return ResponseManager.ErrorResponse(req, res, 400, "ไม่มี OTP สำหรับอีเมลนี้");
      if (Date.now() > record.expires)
        return ResponseManager.ErrorResponse(req, res, 400, "OTP หมดอายุ");
      if (record.otp !== otp)
        return ResponseManager.ErrorResponse(req, res, 400, "OTP ไม่ถูกต้อง");

      delete otpStore[email]; // ลบ OTP หลังใช้แล้ว

      return ResponseManager.SuccessResponse(req, res, 200, {
        message: "ยืนยันสำเร็จ",
      });
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async test(req, res) {
    try {
    
    } catch (err) {
      console.error("Error sending test email:", err);
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

    static async check_business_email(req, res) {
    try {
      let business_id = null;

      const user_list = User.findAll();

      return ResponseManager.SuccessResponse(req, res, 200, user_list);

    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
}

module.exports = LineLiff;
