const jwt = require("jsonwebtoken");
const tokenData = require("./tokenData.json");
const {User,Role} = require('../model/userModel');

class TokenManager{
    static getGenerateAccessToken(payload){
        return jwt.sign(payload,tokenData["secret_key"],{})
    }

    static checkAuthentication(request){
        try{
            let accessToken = request.headers.authorization.split(" ")[1];
            let jwtResponse = jwt.verify(String(accessToken),tokenData["secret_key"]);
            return jwtResponse;
        }catch(error){
            return false;
        }
    }

    static async update_token(req) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const { userID } = jwt.decode(token);

            User.belongsTo(Role, { foreignKey: "RoleID" });
            Role.hasMany(User, { foreignKey: "RoleID" });

            const users = await User.findAll({
                include: [
                    { model: Role },
                    // { model: Distributor }
                ],
                where: { userID: userID }
            });

            if (users.length === 0) {
                return null;
            }

            const payload = {
                userID: users[0].userID,
                // username: users[0].username,
                // user_tel: users[0].user_tel,
                RoleID: users[0].RoleID,
                RoleName:  users[0].role.RoleName ,
                userEmail: users[0].userEmail
                // distributor_id: users[0].distributor_id,
                // distributor_name: users[0].distributor ? users[0].distributor.distributor_name : null
            };

            return payload;
        } catch (error) {
            console.error("Error updating token:", error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }

    static getSecret(){
        return require("crypto").randomBytes(64).toString("hex");
    }
    
}

module.exports = TokenManager;