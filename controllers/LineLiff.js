const ResponseManager = require("../middleware/ResponseManager");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

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
      const { email, name = "User" } = req.body;
      if (!email) {
        return ResponseManager.ErrorResponse(req, res, 400, "Email is required");
      }

      const otp = generateOtp(6);
      otpStore[email] = { otp, expires: Date.now() + 3 * 60 * 1000 };

      // ส่งอีเมลผ่าน Resend
      await resend.emails.send({
        from: "onboarding@resend.dev", // ถ้ายังไม่ได้ verify domain ให้ใช้ของ Resend ก่อน
        to: email,
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
      console.error(err);
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

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
      return ResponseManager.SuccessResponse(req, res, 200, "test ok");
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
}

module.exports = LineLiff;
