const TokenManager = require("../middleware/tokenManager");
const ResponseManager = require("../middleware/ResponseManager");
const logUserActivity = require("../middleware/UserActivity");
const { Op } = require("sequelize");
const { cloudinary } = require("../utils/cloudinary");
const { isError } = require("util");
const {
  User,
  Role,
  Business,
  Bank,
  Employee,
} = require("../model"); 

class AuthController {
  static index(req, res) {
    res.send("From Login");
  }

  static getToken(req, res) {
    res.send(
      TokenManager.getGenerateAccessToken({ username: req.params.username })
    );
  }
  static checkAuthen(req, res) {
    let jwtStatus = TokenManager.checkAuthentication(req);
    if (jwtStatus === false) {
      return res.send("Token Error..");
    }

    const token = req.headers.authorization?.split(" ")[1]; // สมมติว่า token มาในรูปแบบ "Bearer <token>"

    if (!token) {
      return res.status(400).send("Token is missing.");
    }

    res.send(jwtStatus);
  }

  static async login(req, res, next) {
    try {
      const timestamp = Date.now();
      const dateObject = new Date(timestamp);
      const thaiDateString =
        dateObject.toLocaleDateString("th") +
        " " +
        dateObject.toLocaleTimeString("th");

      const { userEmail, userPassword } = req.body;

      // ตรวจสอบว่ามี email และ Password
      if (!userEmail || !userPassword) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "userEmail and userPassword are required"
        );
      }

      // ค้นหาผู้ใช้ในฐานข้อมูล
      const users = await User.findAll({
        include: [{ model: Role }],
        where: { userEmail },
      });

      // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
      if (users.length > 0) {
        const user = users[0];
        const storedPassword = user.userPassword;

        if (userPassword === storedPassword) {
          let token = user.accessToken;

          // หากไม่มี Token เดิมในฐานข้อมูล ให้สร้างใหม่
          if (!token) {
            const payload = {
              userID: user.userID,
              userF_name: user.userF_name,
              userEmail: user.userEmail,
              userRole: user.role.RoleName,
            };

            token = TokenManager.getGenerateAccessToken(payload);

            // อัปเดต Token และเวลาที่สร้างในฐานข้อมูล
            await User.update(
              {
                accessToken: token,
              },
              { where: { userID: user.userID } }
            );
          }

          // บันทึกกิจกรรมของผู้ใช้
          const bodyString = JSON.stringify(req.body);
          await logUserActivity(
            user.userID,
            `Read/login/${user.role.RoleName}`,
            "Login",
            bodyString
          );

          // ส่งข้อมูล Token และรายละเอียดผู้ใช้กลับไป
          return res.json({
            token,
            userID: user.userID,
            userF_name: user.userF_name,
            userEmail: user.userEmail,
            RoleID: user.RoleID,
            RoleName: user.role.RoleName,
            TokenCreate: user.TokenCreate,
          });
        } else {
          // isError = true;
          return ResponseManager.ErrorResponse(
            req,
            res,
            401,
            "Incorrect username or password"
          );
        }
      } else {
        // isError = true;
        return ResponseManager.ErrorResponse(
          req,
          res,
          404,
          "Incorrect username or password"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async RegisterUsers(req, res) {

    const { bus_id } = req.userData;

    try {
      const addemail = await User.findOne({
        where: {
          userEmail: req.body.userEmail,
        },
      });

      if (addemail) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "User already exists"
        );
      }

      const addName = await User.findOne({
        where: {
          userF_name: req.body.userF_name,
          userL_name: req.body.userL_name,
        },
      });
      if (addName) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "User already exists"
        );
      }

      const addPhone = await User.findOne({
        where: {
          userPhone: req.body.userPhone,
        },
      });
      if (addPhone) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "User phone number already exists"
        );
      }

      const oldestUser = await User.findOne({
        where: {
          bus_id: bus_id,
        },
        order: [["TokenCreate", "ASC"]],
      });

      const hashedPassword = req.body.userPassword;
      const insert_cate = await User.create({
        user_title: "Mr.",
        userF_name: req.body.userF_name,
        userL_name: req.body.userL_name,
        userPhone: req.body.userPhone,
        userEmail: req.body.userEmail,
        userPassword: hashedPassword,
        RoleID: req.body.RoleID,
        bus_id: bus_id,
        TokenCreate: oldestUser ? oldestUser.TokenCreate : null,
      });
      return ResponseManager.SuccessResponse(req, res, 200, insert_cate);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async RegisterNewUsers(req, res) {
    try {
      if (!req.body.business_name) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "bus_name is required"
        );
      }
      const existingUser = await User.findOne({
        where: {
          userEmail: req.body.userEmail,
        },
      });
      if (existingUser) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "User already exists"
        );
      }

      let result = [];
      if (req.file) {
        const allowedMimeTypes = ["image/jpeg", "image/png"];
        if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
          return ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "Only JPEG and PNG image files are allowed"
          );
        }
        else if (req.file && req.file.size > 5 * 1024 * 1024) {
          return ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "File size exceeds 5 MB limit"
          );
        }

        result = await cloudinary.uploader.upload(req.file.path);
      }

      const createbank = await Bank.create({
        bank_name: req.body.bank_name,
        bank_account: req.body.bank_account,
        bank_number: req.body.bank_number,
      });

      let createdBusiness = null;
      if (createbank) {
        createdBusiness = await Business.create({
          business_name: req.body.business_name,
          business_address: req.body.business_address,
          business_website: req.body.business_website || "",
          business_tel: req.body.business_tel,
          business_tax: req.body.business_tax,
          business_logo: result.secure_url,
          bank_id: createbank.bank_id,
        });
        console.log("Business creation result:", createdBusiness);
      }

      if (createdBusiness) {
        const hashedPassword = req.body.userPassword;
        const timestamp = Date.now();
        const dateObject = new Date(timestamp);
        const thaiDateString =
          dateObject.toLocaleDateString("th") +
          " " +
          dateObject.toLocaleTimeString("th");

        const insertUser = await User.create({
          user_title: req.body.user_title,
          userF_name: req.body.userF_name,
          userL_name: req.body.userL_name,
          userPhone: req.body.userPhone,
          userEmail: req.body.userEmail,
          userPassword: hashedPassword, 
          RoleID: 1,
          bus_id: createdBusiness.bus_id,
          TokenCreate: thaiDateString,
        });

        await Employee.create({
          title: req.body.user_title,
          first_name: req.body.userF_name,
          last_name: req.body.userL_name,
          address: "",
          birth_date: "",
          national_id_number: "",
          phone_number: req.body.userPhone,
          email: req.body.userEmail,
          start_working_date: null,
          salary: 0,
          employee_type: "",
          bank_name: "",
          bank_account_id: "",
          position_id: null,
          department_id: null,
          bus_id: createdBusiness.bus_id,
          employee_status: "active",
        });

        console.log("User creation result:", insertUser);
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, insertUser);
      } else {
        return ResponseManager.ErrorResponse(
          req,
          res,
          500,
          "Failed to create Business"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditUsers(req, res) {
    try {
      const editemp = await User.findOne({
        where: {
          userID: req.params.id,
        },
      });
      if (editemp) {
        const { bus_id } = req.userData;

        const existingUser = await User.findOne({
          where: {
            [Op.and]: [
              { bus_id }, 
              {
                [Op.or]: [
                  {
                    userEmail: req.body.userEmail,
                    userID: { [Op.ne]: req.params.id },
                  },
                  {
                    userF_name: req.body.userF_name,
                    userID: { [Op.ne]: req.params.id },
                  },
                  {
                    userL_name: req.body.userL_name,
                    userID: { [Op.ne]: req.params.id },
                  },
                  {
                    userPassword: req.body.userPassword,
                    userID: { [Op.ne]: req.params.id },
                  },
                ],
              },
            ],
          },
        });

        if (existingUser) {
          return ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "email,UserName,LastName,Password already exists"
          );
        }
        const hashedPassword = req.body.userPassword;
        await User.update(
          {
            userF_name: req.body.userF_name,
            userL_name: req.body.userL_name,
            userPhone: req.body.userPhone,
            userEmail: req.body.userEmail,
            userPassword: hashedPassword,
            RoleID: req.body.RoleID,
          },
          {
            where: {
              userID: req.params.id,
            },
          }
        );
        return ResponseManager.SuccessResponse(req, res, 200, "User Updated");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async GetUsers(req, res) {

    const { bus_id } = req.userData;

    try {
      const Users = await User.findAll({
        include: [
          {
            model: Role,
          },
        ],
        where: {
          bus_id: bus_id,
        },
      });

      return ResponseManager.SuccessResponse(req, res, 200, Users);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async GetUserByID(req, res) {
    User.belongsTo(Role, { foreignKey: "RoleID" });
    try {
      const Users = await User.findOne({
        include: [
          {
            model: Role,
          },
        ],
        where: {
          userID: req.params.id,
        },
      });

      return ResponseManager.SuccessResponse(req, res, 200, Users);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeleteUsers(req, res) {
    try {
      const deletecate = await User.findOne({
        where: {
          userID: req.params.id,
        },
      });
      const UserGetAll = await User.findAll();

      if (deletecate) {
        if (UserGetAll.length == 2) {
          return ResponseManager.SuccessResponse(
            req,
            res,
            400,
            "User have only 1 , cant not delete"
          );
        } else {
          await User.destroy({
            where: {
              userID: req.params.id,
            },
          });
          return ResponseManager.SuccessResponse(req, res, 200, "User Deleted");
        }
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No User found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async forgetPassword(req, res) {
    try {
      const editemp = await User.findAll({
        where: {
          userEmail: req.body.userEmail,
        },
      });

      if (editemp) {
        const editpassword = await User.findAll({
          where: {
            userPassword: req.body.userPassword,
          },
        });

        if (editpassword) {
          return ResponseManager.SuccessResponse(
            req,
            res,
            400,
            "Password already exists"
          );
        } else {
          await User.update(
            {
              userPassword: req.body.userPassword,
            },
            {
              where: {
                userEmail: req.body.userEmail,
              },
            }
          );
          return ResponseManager.SuccessResponse(
            req,
            res,
            200,
            "Password Updated"
          );
        }
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, `email not found`);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async checkEmail(req, res) {
    try {
      const editemp = await User.findOne({
        where: {
          userEmail: req.body.userEmail,
        },
      });

      if (editemp) {
        return ResponseManager.SuccessResponse(req, res, 200, "correct email");
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, `email not found`);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async GetRole(req, res) {
    try {
      const Roles = await Role.findAll();

      return ResponseManager.SuccessResponse(req, res, 200, Roles);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddRole(req, res) {
    try {
      const addcate = await Role.findOne({
        where: {
          RoleName: req.body.RoleName,
        },
      });
      if (addcate) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Role already exists"
        );
      } else {
        const insert_cate = await Role.create({
          RoleName: req.body.RoleName,
        });
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, insert_cate);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditRole(req, res) {
    try {
      const editemp = await Role.findOne({
        where: {
          RoleID: req.params.id,
        },
      });
      if (editemp) {
        const existingUser = await Role.findOne({
          where: {
            RoleName: req.body.RoleName,
            RoleID: { [Op.ne]: req.params.id }, // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
          },
        });

        if (existingUser) {
          await ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "Role already exists"
          );
          return;
        }

        await Role.update(
          {
            RoleName: req.body.RoleName,
          },
          {
            where: {
              RoleID: req.params.id,
            },
          }
        );
        return ResponseManager.SuccessResponse(req, res, 200, "Role Updated");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeleteRole(req, res) {
    try {
      const deletecate = await Role.findOne({
        where: {
          RoleID: req.params.id,
        },
      });
      if (deletecate) {
        await Role.destroy({
          where: {
            RoleID: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(req, res, 200, "Role Deleted");
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No Role found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
}
module.exports = AuthController;

// refactor ความสั้น โอเคแล้ว