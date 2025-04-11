const jwt = require("jsonwebtoken");
const tokenData = require("./tokenData.json");
const { User, Role } = require("../model/userModel");
const { Business } = require("../model/quotationModel");

class TokenManager {
  static getGenerateaccess_token(payload) {
    return jwt.sign(payload, tokenData["secret_key"], {});
  }

  static checkAuthentication(request) {
    try {
      let access_token = request.headers.authorization.split(" ")[1];
      let jwtResponse = jwt.verify(
        String(access_token),
        tokenData["secret_key"]
      );
      return jwtResponse;
    } catch (error) {
      return false;
    }
  }

  static async update_token(req) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { user_id } = jwt.decode(token);

      User.belongsTo(Role, { foreignKey: "role_id" });
      Role.hasMany(User, { foreignKey: "role_id" });

      User.belongsTo(Business, { foreignKey: "business_id" });
      Business.hasMany(User, { foreignKey: "business_id" });

      const users = await User.findAll({
        include: [{ model: Role }, { model: Business }],
        where: { user_id: user_id },
      });

      if (users.length === 0) {
        return null;
      }

      const payload = {
        user_id: users[0].user_id,
        business_id: users[0].business_id,
        role_id: users[0].role_id,
        role_name: users[0].role.role_name,
        email: users[0].email,
      };

      return payload;
    } catch (error) {
      console.error("Error updating token:", error);
      throw error;
    }
  }

  static getSecret() {
    return require("crypto").randomBytes(64).toString("hex");
  }
}

module.exports = TokenManager;
