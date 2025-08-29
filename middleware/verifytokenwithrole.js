const jwt = require("jsonwebtoken");
const { User, Role } = require("../model/userModel");
const { Business } = require("../model/quotationModel");
const tokenData = require("./tokenData.json");
const { Op } = require("sequelize");
const { UserActivity } = require("../model/userModel");

const verifyTokenWithRole = (requiredRoles) => (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    return next();
  }

  jwt.verify(token, tokenData["secret_key"], (err, decoded) => {
    console.log(err);
    if (err) {
      return next();
    }

    User.belongsTo(Role, { foreignKey: "role_id" });
    Role.hasMany(User, { foreignKey: "role_id" });


    console.log(requiredRoles);

    User.findAll({
      include: [
        {
          model: Role,
          where: {
            role_name: {
              [Op.in]: requiredRoles,
            },
          },
        },
      ],
      where: {
        user_id: decoded.user_id,
        access_token: token,
      },
    })
      .then((users) => {
        if (!Array.isArray(users)) {
          return next();
        }

        const userRoles = users.map((u) => u.role.role_name);

        if (!Array.isArray(userRoles)) {
          return next();
        }

        const hasRequiredRole = requiredRoles.some((role) =>
          userRoles.includes(role)
        );

        if (!hasRequiredRole) {
          return next();
        }

        req.user = decoded;

        req.userData = { 
          ...req.userData,
          userId: req.user.user_id, 
          role: req.user.userRole };
        next();
      })
      .catch((error) => {
        console.error("Error checking token in the database:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      });
  });
};

const logUserActivity = (activityType, routeName) => {
  return async (req, res, next) => {
    const { method, url, body } = req;

    const timestamp = Date.now();
    const dateObject = new Date(timestamp);

    const thaiDateString =
      dateObject.toLocaleDateString("th") +
      " " +
      dateObject.toLocaleTimeString("th");

    const loggedUserId = (req.userData && req.userData.userId) || "unknown";
    const role = (req.userData && req.userData.role) || "unknown";

    try {
      const bodyString = JSON.stringify(body);

      if (loggedUserId === "unknown" || role === "unknown") {
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
          .json({
            message:
              "No token provided , Forbidden: Insufficient permissions , Unauthorized: Invalid data format in the database , Unauthorized: Invalid token",
          });
      } else {
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

const verifyTokenWithbus_id = async (req, res, next) => {
  User.belongsTo(Business, { foreignKey: "business_id" });
  Business.hasMany(User, { foreignKey: "business_id" });

  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = req.headers.authorization.replace("Bearer ", "");

    jwt.verify(token, tokenData["secret_key"], async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      const userIDFromToken = decoded.user_id;

      try {
        const user = await User.findOne({
          include: [
            {
              model: Business,
              attributes: ["business_id", "business_name"],
            },
          ],
          where: {
            user_id: userIDFromToken,
            access_token: token, 
          },
        });

        if (!user) {
          return res
            .status(403)
            .json({ message: "Forbidden: Invalid business ID or user" });
        }

        req.userData = {
          ...req.userData,
          userId: user.user_id,
          business_id: user.business.business_id, 
        };

        next();
      } catch (dbError) {
        console.error(
          "Error checking token and business_id in the database:",
          dbError
        );
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden: Error processing request" });
  }
};

module.exports = {
  verifyTokenWithRole,
  logUserActivity,
  verifyTokenWithbus_id,
};
