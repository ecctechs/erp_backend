const TokenManager = require("./tokenManager");
const ResponseManager = require("./ResponseManager");

const authMiddleware = async (req, res, next) => {
  try {
    // 1. ดึง Token จาก Authorization header (ส่วนนี้ยังเหมือนเดิม)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: No token provided");
    }
    
    // 2. ตรวจสอบและถอดรหัส Token โดยส่ง 'req' เข้าไปทั้ง object
    const decodedPayload = TokenManager.checkAuthentication(req); // << แก้ไขบรรทัดนี้
    
    if (!decodedPayload) {
      return ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token");
    }

    // 3. แนบข้อมูล user ไปกับ request object
    req.userData = decodedPayload;

    // 4. ส่งต่อไปยัง Controller
    next();

  } catch (err) {
    return ResponseManager.CatchResponse(req, res, "Unauthorized: " + err.message);
  }
};

module.exports = authMiddleware;