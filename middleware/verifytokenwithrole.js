const jwt = require("jsonwebtoken");
const { User, Role } = require("../model/userModel"); // call model  // ต้องแก้ตามโครงสร้างโปรเจ็คของคุณ
const { Business } = require("../model/quotationModel");
const tokenData = require("./tokenData.json");
const { Op } = require("sequelize");
const { UserActivity } = require("../model/userModel"); // call model

const verifyTokenWithRole = (requiredRoles) => (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  //  console.log(token);

  if (!token) {
    // return logUserActivity('Unauthorized: No token provided', 'N/A')(req, res, next);
    return next();
  }


  jwt.verify(token, tokenData["secret_key"], (err, decoded) => {
     console.log(err)
    if (err) {
      return next();
      // return logUserActivity('Unauthorized: Invalid token', 'N/A')(req, res, next);
      // return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    User.belongsTo(Role, { foreignKey: "RoleID" });
    Role.hasMany(User, { foreignKey: "RoleID" });

    User.belongsTo(Business, { foreignKey: "bus_id" });
    Business.hasMany(User, { foreignKey: "bus_id" });

    console.log(requiredRoles);

    User.findAll({
      include: [
        {
          model: Role,
          where: {
            RoleName: {
              [Op.in]: requiredRoles,
            },
          },
        },
      ],
      where: {
        userID: decoded.userID,
        accessToken: token,
      },
    })
      .then((users) => {
        if (!Array.isArray(users)) {
          return next();
          // return logUserActivity('Unauthorized: Token not found in the database', 'N/A')(req, res, next);
          // return res
          //   .status(401)
          //   .json({ message: "Unauthorized: Token not found in the database" });
        }

        // Check user roles
        const userRoles = users.map((u) => u.role.RoleName);

        if (!Array.isArray(userRoles)) {
          return next();
          // return logUserActivity('Unauthorized: Invalid data format in the database', 'N/A')(req, res, next);
          // return res
          //   .status(401)
          //   .json({
          //     message: "Unauthorized: Invalid data format in the database",
          //   });
        }

        const hasRequiredRole = requiredRoles.some((role) =>
          userRoles.includes(role)
        );

        if (!hasRequiredRole) {
          return next();
          // return logUserActivity('Forbidden: Insufficient permissions', 'N/A')(req, res, next);
          // return res
          //   .status(403)
          //   .json({ message: "Forbidden: Insufficient permissions" });
        }

        // Token is valid, and user roles match the required roles
        req.user = decoded;
        // console.log(req.user)

        req.userData = { userId: req.user.userID, role: req.user.userRole };
        next();
      })
      .catch((error) => {
        console.error("Error checking token in the database:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      });
  });
};

// Middleware function สำหรับบันทึกกิจกรรมผู้ใช้
const logUserActivity = (activityType, routeName) => {
  return async (req, res, next) => {
    const { method, url, body } = req;

    const timestamp = Date.now();
    const dateObject = new Date(timestamp);

    // กำหนด locale เป็น 'th' และใช้ toLocaleDateString() และ toLocaleTimeString() ในการแสดงวันที่และเวลา
    const thaiDateString = dateObject.toLocaleDateString('th') + ' ' + dateObject.toLocaleTimeString('th');
    
    const loggedUserId = (req.userData && req.userData.userId) || "unknown";
    const role = (req.userData && req.userData.role) || "unknown";

    try {
      // รอรับค่า status code จากคำขอ (response) ที่ถูกส่งกลับ
      const bodyString = JSON.stringify(body);
 
      if(loggedUserId === "unknown" || role === "unknown"){

        await UserActivity.create({
          userId: loggedUserId,
          activityType: `${activityType}/${role}`,
          routeName: routeName,
          method: method,
          url: url,
          body: bodyString,
          timestamp: thaiDateString,
        });
        await res
            .status(401)
            .json({ message: "No token provided , Forbidden: Insufficient permissions , Unauthorized: Invalid data format in the database , Unauthorized: Invalid token"});
      }else{
        await UserActivity.create({
          userId: loggedUserId,
          activityType: `${activityType}/${role}`,
          routeName: routeName,
          method: method,
          url: url,
          body: bodyString,
          timestamp: thaiDateString,
        });

        return next();
      }

    } catch (error) {
      console.error("Error logging user activity:", error);
    }                       
  };
};

module.exports = {
  verifyTokenWithRole,
  logUserActivity,
  // ตัวอย่างอื่น ๆ ของ controller สามารถเพิ่มต่อได้
};
