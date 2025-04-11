// const bcrypt = require('bcrypt');
var bcrypt = require("bcryptjs");
const TokenManager = require("../middleware/tokenManager");
const ResponseManager = require("../middleware/ResponseManager");
const { User, Role } = require("../model/userModel"); // call model
const { Business, Bank } = require("../model/quotationModel");
const logUserActivity = require("../middleware/UserActivity");
const { Op } = require("sequelize");
const { cloudinary } = require("../utils/cloudinary");

class AuthController {
  static index(req, res) {
    res.send("From Login");
  }

  static getToken(req, res) {
    res.send(
      TokenManager.getGenerateaccess_token({ username: req.params.username })
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
      // กำหนดความสัมพันธ์ระหว่าง User และ Role
      User.belongsTo(Role, { foreignKey: "role_id" });
      Role.hasMany(User, { foreignKey: "role_id" });

      const timestamp = Date.now();
      const dateObject = new Date(timestamp);
      const thaiDateString =
        dateObject.toLocaleDateString("th") +
        " " +
        dateObject.toLocaleTimeString("th");

      const { email, password } = req.body;

      // ตรวจสอบว่ามี Email และ Password
      if (!email || !password) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "email and password are required"
        );
      }

      // ค้นหาผู้ใช้ในฐานข้อมูล
      const users = await User.findAll({
        include: [{ model: Role }],
        where: { email },
      });

      // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
      if (users.length > 0) {
        const user = users[0];
        const storedPassword = user.password;

        // ตรวจสอบรหัสผ่าน
        if (password === storedPassword) {
          let token = user.access_token;

          // หากไม่มี Token เดิมในฐานข้อมูล ให้สร้างใหม่
          if (!token) {
            const payload = {
              user_id: user.user_id,
              firstname: user.firstname,
              email: user.email,
              userRole: user.role.role_name,
            };

            token = TokenManager.getGenerateaccess_token(payload);

            // อัปเดต Token และเวลาที่สร้างในฐานข้อมูล
            await User.update(
              {
                access_token: token,
                token_creation_date: thaiDateString,
              },
              { where: { user_id: user.user_id } }
            );
          }

          // บันทึกกิจกรรมของผู้ใช้
          const bodyString = JSON.stringify(req.body);
          await logUserActivity(
            user.user_id,
            `Read/login/${user.role.role_name}`,
            "Login",
            bodyString
          );

          // ส่งข้อมูล Token และรายละเอียดผู้ใช้กลับไป
          return res.json({
            token,
            user_id: user.user_id,
            firstname: user.firstname,
            email: user.email,
            role_id: user.role_id,
            role_name: user.role.role_name,
          });
        } else {
          return ResponseManager.ErrorResponse(
            req,
            res,
            401,
            "Incorrect username or password"
          );
        }
      } else {
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

  // static async login(req, res, next) {
  //   try {
  //     User.belongsTo(Role, { foreignKey: "role_id" });
  //     Role.hasMany(User, { foreignKey: "role_id" });

  //     const timestamp = Date.now();
  //     const dateObject = new Date(timestamp);

  //     const thaiDateString =
  //       dateObject.toLocaleDateString("th") +
  //       " " +
  //       dateObject.toLocaleTimeString("th");

  //     const { email, password } = req.body;
  //     if (!email || !password) {
  //       return ResponseManager.ErrorResponse(
  //         req,
  //         res,
  //         400,
  //         "email and password are required"
  //       );
  //     }

  //     const users = await User.findAll({
  //       include: [
  //         {
  //           model: Role,
  //         },
  //       ],
  //       where: {
  //         email: email,
  //       },
  //     });

  //     if (users.length > 0) {
  //       const storedPassword = users[0].password;

  //       if (password === storedPassword) {
  //         const payload = {
  //           user_id: users[0].user_id,
  //           firstname: users[0].firstname,
  //           email: users[0].email,
  //           userRole: users[0].role.role_name,
  //         };

  //         const token = TokenManager.getGenerateaccess_token(payload);

  //         await User.update(
  //           {
  //             access_token: token,
  //             token_creation_date: thaiDateString,
  //           },
  //           {
  //             where: {
  //               user_id: users[0].user_id,
  //             },
  //           }
  //         );
  //         const bodyString = JSON.stringify(req.body);

  //         await logUserActivity(
  //           users[0].user_id,
  //           `Read/login/${users[0].role.role_name}`,
  //           "Login",
  //           bodyString
  //         );

  //         res.json({
  //           token,
  //           user_id: users[0].user_id,
  //           firstname: users[0].firstname,
  //           email: users[0].email,
  //           role_id: users[0].role_id,
  //           role_name: users[0].role.role_name,
  //         });
  //       } else {
  //         return ResponseManager.ErrorResponse(
  //           req,
  //           res,
  //           401,
  //           "Incorrect username or password"
  //         );
  //       }
  //     } else {
  //       return ResponseManager.ErrorResponse(
  //         req,
  //         res,
  //         404,
  //         "Incorrect username or password"
  //       );
  //     }
  //   } catch (err) {
  //     return ResponseManager.CatchResponse(req, res, err.message);
  //   }
  // }

  static async RegisterUsers(req, res) {
    User.belongsTo(Business, { foreignKey: "business_id" });
    Business.hasMany(User, { foreignKey: "business_id" });

    const { business_id } = req.userData;

    try {
      const addemail = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (addemail) {
        return ResponseManager.ErrorResponseResponse(
          req,
          res,
          400,
          "User already exists"
        );
      }

      const checkPass = await User.findOne({
        where: {
          password: req.body.password,
        },
      });

      if (checkPass) {
        return ResponseManager.ErrorResponseResponse(
          req,
          res,
          400,
          "Password already exists"
        );
      }

      const addName = await User.findOne({
        where: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
        },
      });
      if (addName) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "User already exists"
        );
      }

      const addPhone = await User.findOne({
        where: {
          phone: req.body.phone,
        },
      });
      if (addPhone) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "User phone number already exists"
        );
      }
      const insert_cate = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        role_id: req.body.role_id,
        business_id: business_id,
      });
      console.log(req.body);
      return ResponseManager.SuccessResponse(req, res, 200, insert_cate);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async RegisterNewUsers(req, res) {
    User.belongsTo(Business, { foreignKey: "business_id" });
    Business.hasMany(User, { foreignKey: "business_id" });

    console.log("req.body:", req.body); // ดูข้อมูลทั้งหมดที่ถูกส่งมาจาก frontend

    try {
      if (!req.body.bus_name) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "bus_name is required"
        );
      }
      const existingUser = await User.findOne({
        where: {
          email: req.body.email,
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

      const existingBus = await Business.findOne({
        where: {
          bus_name: req.body.bus_name,
        },
      });
      if (existingBus) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Business already exists"
        );
      }

      // if (!req.file) {
      //   return ResponseManager.ErrorResponse(req, res, 400, "No file uploaded");
      // }
      const result = [];
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
        if (req.file && req.file.size > 5 * 1024 * 1024) {
          return ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "File size exceeds 5 MB limit"
          );
        }

        result = await cloudinary.uploader.upload(req.file.path);
      }
      console.log("Cloudinary upload result:", result);

      const createbank = await Bank.create({
        bank_name: req.body.bank_name,
        bank_account: req.body.bank_account,
        bank_number: req.body.bank_number,
      });

      console.log("Bank creation result:", createbank);

      let createdBusiness = null;
      if (createbank) {
        createdBusiness = await Business.create({
          bus_name: req.body.bus_name,
          bus_address: req.body.bus_address,
          bus_website: req.body.bus_website,
          bus_tel: req.body.bus_tel,
          bus_tax: req.body.bus_tax,
          bus_logo: result.secure_url,
          bank_id: createbank.bank_id,
        });
        console.log("Business creation result:", createdBusiness);
      }

      if (createdBusiness) {
        const insertUser = await User.create({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phone: req.body.phone,
          email: req.body.email,
          password: req.body.password,
          role_id: 1,
          business_id: createdBusiness.business_id,
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
          user_id: req.params.id,
        },
      });
      if (editemp) {
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [
              {
                email: req.body.email,
                user_id: { [Op.ne]: req.params.id },
              },
              {
                firstname: req.body.firstname,
                user_id: { [Op.ne]: req.params.id },
              },
              {
                lastname: req.body.lastname,
                user_id: { [Op.ne]: req.params.id },
              },
              {
                password: req.body.password,
                user_id: { [Op.ne]: req.params.id },
              },
            ],
          },
        });

        if (existingUser) {
          return ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "Email,UserName,LastName,Password already exists"
          );
        }

        await User.update(
          {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            role_id: req.body.role_id,
          },
          {
            where: {
              user_id: req.params.id,
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
    User.belongsTo(Role, { foreignKey: "role_id" });
    User.belongsTo(Business, { foreignKey: "business_id" });
    Business.hasMany(User, { foreignKey: "business_id" });

    const { business_id } = req.userData;

    try {
      const Users = await User.findAll({
        include: [
          {
            model: Role,
          },
        ],
        where: {
          business_id: business_id,
        },
      });

      return ResponseManager.SuccessResponse(req, res, 200, Users);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async GetUserByID(req, res) {
    User.belongsTo(Role, { foreignKey: "role_id" });
    try {
      const Users = await User.findOne({
        include: [
          {
            model: Role,
          },
        ],
        where: {
          user_id: req.params.id,
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
          user_id: req.params.id,
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
              user_id: req.params.id,
            },
          });
          return ResponseManager.SuccessResponse(req, res, 200, "User Deleted");
          // return ResponseManager.SuccessResponse(req, res, 200, UserGetAll.length);
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
          email: req.body.email,
        },
      });

      if (editemp) {
        const editpassword = await User.findAll({
          where: {
            password: req.body.password,
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
              password: req.body.password,
            },
            {
              where: {
                email: req.body.email,
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
        return ResponseManager.ErrorResponse(req, res, 400, `Email not found`);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async checkEmail(req, res) {
    try {
      const editemp = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (editemp) {
        return ResponseManager.SuccessResponse(req, res, 200, "correct email");
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, `Email not found`);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  // static async forgetPassword(req, res) {
  //   try {
  //     const editemp = await User.findOne({
  //       where: {
  //         email: req.body.email,
  //       },
  //     });
  //     const user_email = editemp.email;
  //     if (editemp) {
  //       const editpassword = await User.findOne({
  //         where: {
  //           password: req.body.password,
  //         },
  //       });

  //       if (editpassword) {
  //         return ResponseManager.SuccessResponse(
  //           req,
  //           res,
  //           400,
  //           "Password already exists"
  //         );
  //       } else {
  //         await User.update(
  //           {
  //             password: req.body.password,
  //           },
  //           {
  //             where: {
  //               email: req.body.email,
  //             },
  //           }
  //         );
  //         return ResponseManager.SuccessResponse(
  //           req,
  //           res,
  //           200,
  //           "Password Updated"
  //         );
  //       }
  //     } else {
  //       return ResponseManager.ErrorResponse(
  //         req,
  //         res,
  //         400,
  //         `Email ${user_email} not found`
  //       );
  //     }
  //   } catch (err) {
  //     return ResponseManager.CatchResponse(req, res, err.message);
  //   }
  // }

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
          role_name: req.body.role_name,
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
          role_name: req.body.role_name,
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
          role_id: req.params.id,
        },
      });
      if (editemp) {
        const existingUser = await Role.findOne({
          where: {
            role_name: req.body.role_name,
            role_id: { [Op.ne]: req.params.id }, // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
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
            role_name: req.body.role_name,
          },
          {
            where: {
              role_id: req.params.id,
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
          role_id: req.params.id,
        },
      });
      if (deletecate) {
        await Role.destroy({
          where: {
            role_id: req.params.id,
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
