// const bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs');
const TokenManager = require('../middleware/tokenManager');
const ResponseManager = require("../middleware/ResponseManager");
const {User, Role } = require('../model/userModel'); // call model
const { Business, Bank } = require('../model/quotationModel')
const logUserActivity = require('../middleware/UserActivity');
const { Op } = require('sequelize');
const { cloudinary } = require('../utils/cloudinary');


// const { Pool } = require('pg');
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'Test_VueJS_Project',
//     password: '123456',
//     port: 5432,
//   });
  

class AuthController {
    
    static index(req,res){
        res.send('From Login');
    }

    static getToken(req,res){
        res.send(TokenManager.getGenerateAccessToken({"username":req.params.username}));
    }
    static checkAuthen(req,res){
        let jwtStatus = TokenManager.checkAuthentication(req);
        if(jwtStatus===false){
          res.send("Token Error..");
        }else{
          res.send(jwtStatus);
        }
    }

    static async login(req, res, next) {
        try {
            User.belongsTo(Role, { foreignKey: "RoleID" });
            Role.hasMany(User, { foreignKey: "RoleID" });

            const timestamp = Date.now();
            const dateObject = new Date(timestamp);

            // กำหนด locale เป็น 'th' และใช้ toLocaleDateString() และ toLocaleTimeString() ในการแสดงวันที่และเวลา
            const thaiDateString = dateObject.toLocaleDateString('th') + ' ' + dateObject.toLocaleTimeString('th');

            // ตรวจสอบค่าที่รับจาก req.body
            const { userEmail, userPassword } = req.body;
            if (!userEmail || !userPassword) {
                return ResponseManager.ErrorResponse(req, res, 400, 'userEmail and userPassword are required');
            }

            const users = await User.findAll({
                include: [{
                    model: Role,
                    where: {
                        // เพิ่มเงื่อนไขที่ต้องการใน Role
                        // ตัวอย่าง: หา RoleID เท่ากับ 1
                    },
                }],
                where: {
                    userEmail: userEmail,
                },
            });

            if (users.length > 0) {
                // ถ้ามีผู้ใช้
                const storedPassword = users[0].userPassword;

                // เปรียบเทียบรหัสผ่านที่ผู้ใช้ป้อนกับรหัสผ่านที่เก็บไว้ในฐานข้อมูล
                if (userPassword === storedPassword) {
                    const payload = {
                        userID: users[0].userID,
                        userF_name: users[0].userF_name,
                        userEmail: users[0].userEmail,
                        userRole: users[0].role.RoleName
                    };

                    const token = TokenManager.getGenerateAccessToken(payload);

                    await User.update(
                        {
                            accessToken: token,
                            TokenCreate: thaiDateString
                        },
                        {
                            where: {
                                userID: users[0].userID,
                            },
                        }
                    );
                    const bodyString = JSON.stringify(req.body);

                    await logUserActivity(users[0].userID, `Read/login/${users[0].role.RoleName}`, 'Login', bodyString);

                    res.json({
                        token,
                        userID: users[0].userID,
                        userF_name: users[0].userF_name,
                        userEmail: users[0].userEmail,
                        RoleID: users[0].RoleID,
                        RoleName: users[0].role.RoleName,
                    });

                } else {
                    // รหัสผ่านไม่ถูกต้อง
                    return ResponseManager.ErrorResponse(req, res, 401, 'Incorrect username or password');
                }
            } else {
                // ไม่พบผู้ใช้
                return ResponseManager.ErrorResponse(req, res, 404, 'Incorrect username or password');
            }
        } catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message);
        }
    }


    // static async login(req,res, next){
    //     try{
        
    //         let userlogin = [];
    //         const Users = await User.findOne({
    //             where: {
    //                 userEmail: req.body.useremail,
    //                 userPassword: req.body.password,
    //               },
    //         })    

    //             const data = {};
    //             data.userID = Users.userID;
    //             data.userF_name = Users.userF_name;
    //             data.userL_name = Users.userL_name;
    //             data.userPhone = Users.userPhone;
    //             data.userEmail = Users.userEmail;
    //             data.userPassword = Users.userPassword;

    //             const Roles = await Role.findAll({
    //                 where:{
    //                     RoleID: Users.RoleID,
    //                 }
    //               });           

    //             if(Roles != ""){

    //             data.RoleID = Roles[0].dataValues.RoleID;
    //             data.RoleName = Roles[0].dataValues.RoleName;

    //             }else{
    //                 data.RoleID = Users.RoleID;
    //                 data.RoleName = "null";
    //             }

    //             userlogin.push(data);  

    //         if(userlogin){
    //               const payload = {
    //             userID: userlogin[0].userID,
    //             userF_name: userlogin[0].userF_name,
    //             userEmail: userlogin[0].userEmail,
    //         };

    //         const token = TokenManager.getGenerateAccessToken(payload);
            
    //         res.json({ 
    //             token, 
    //             userID: userlogin[0].userID,
    //             userF_name: userlogin[0].userF_name,
    //             userEmail: userlogin[0].userEmail,
    //             RoleID:userlogin[0].RoleID,
    //             RoleName:userlogin[0].RoleName,
    //         });

    //         // logUserActivity(userlogin[0].userID, 'Login','Product');

    //         }else{
    //             return res.status(401).json({ error: 'Invalid username or password' });
    //         }

    //         // const { username, password } = req.body;
    //         // const userQuery = await pool.query('SELECT * FROM users WHERE userEmail = $1 AND userPassword = $2', [username, password]);
    //         // if (userQuery.rows.length === 0) {
    //         //     return res.status(401).json({ error: 'Invalid username or password' });
    //         // }

    //         // const passwordMatch = await bcrypt.compare(password, user.password_login);

    //         // const user = userQuery.rows[0];

    //         // const passwordMatch = await bcrypt.compare(password, user.password_login);
    //         // if (!passwordMatch) {
    //         //     return res.status(401).json({ error: 'Invalid username or password' });
    //         //   }           

    //         // const payload = {
    //         //     userID: user.userID,
    //         //     userF_name: user.userF_name,
    //         //     userEmail: user.userEmail,
    //         // };
            
    //         // const token = TokenManager.getGenerateAccessToken(payload);
        

    //         // res.json({ 
    //         //     token, 
    //         //     userID: user.userID, 
    //         //     userF_name: user.userF_name, 
    //         //     userEmail: user.userEmail 
    //         // });

    //     }catch(err){
    //         await ResponseManager.CatchResponse(req,res,err.message)
    //     }
    // }

    static async RegisterUsers (req, res) { //add category
        User.belongsTo(Business, { foreignKey: "bus_id" });
        Business.hasMany(User, { foreignKey: "bus_id" });

        const tokenData = await TokenManager.update_token(req);
        if (!tokenData) {
          return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
        }
    
        const { RoleName, userID, userEmail, BusID } = tokenData;


        try {   
           
            const addemail = await User.findOne({
                where: {
                    userEmail: req.body.userEmail,
                  },
            })         
                if(addemail){
                    return ResponseManager.ErrorResponseResponse(req,res,400,"User already exists") 
                }

                const addName = await User.findOne({
                    where: {
                        userF_name:req.body.userF_name, 
                        userL_name:req.body.userL_name,
                      },
                })         
                    if(addName){
                        return ResponseManager.SuccessResponse(req,res,400,"User already exists") 
                    }

                    const addPhone = await User.findOne({
                        where: {
                            userPhone:req.body.userPhone,  
                          },
                    })         
                        if(addPhone){
                            return ResponseManager.SuccessResponse(req,res,400,"User phone number already exists") 
                        }
                    //const hashedPassword = await bcrypt.hash(req.body.userPassword, 10);
                    const insert_cate = await User.create({
                        userF_name:req.body.userF_name, 
                        userL_name:req.body.userL_name,   
                        userPhone:req.body.userPhone,   
                        userEmail:req.body.userEmail,   
                        userPassword:req.body.userPassword,   
                        RoleID:req.body.RoleID,     
                        bus_id: BusID,
                    })
                    console.log(req.body)
                    return ResponseManager.SuccessResponse(req,res,200,(insert_cate))   
                        
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }

    static async RegisterNewUsers(req, res) { 
        // เชื่อมโยง User กับ Business ผ่าน bus_id
        User.belongsTo(Business, { foreignKey: "bus_id" });
        Business.hasMany(User, { foreignKey: "bus_id" });
    

        console.log("req.body:", req.body);  // ดูข้อมูลทั้งหมดที่ถูกส่งมาจาก frontend

        try {

            if (!req.body.bus_name) {
                return ResponseManager.ErrorResponse(req, res, 400, "bus_name is required");
            }
            // ตรวจสอบว่าผู้ใช้งานมีอยู่ในระบบหรือยัง
            const existingUser = await User.findOne({
                where: {
                    userEmail: req.body.userEmail,
                },
            });
            if (existingUser) {
                return ResponseManager.ErrorResponse(req, res, 400, "User already exists");
            }
    
            // ตรวจสอบว่ามี Business ที่มีชื่อซ้ำหรือไม่
            const existingBus = await Business.findOne({
                where: {
                    bus_name: req.body.bus_name,
                },
            });
            if (existingBus) {
                return ResponseManager.SuccessResponse(req, res, 400, "Business already exists");
            }
    
            if (!req.file) {
                return ResponseManager.ErrorResponse(req, res, 400, "No file uploaded");
            }

            // ตรวจสอบไฟล์รูปภาพที่อัปโหลด
            const allowedMimeTypes = ['image/jpeg', 'image/png'];
            if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
                return ResponseManager.ErrorResponse(req, res, 400, "Only JPEG and PNG image files are allowed");
            }
            if (req.file && req.file.size > 5 * 1024 * 1024) {
                res.status(400).json({ error: "File size exceeds 5 MB limit" });
            }
    
            // อัปโหลดโลโก้ไปยัง Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
    
            console.log("Cloudinary upload result:", result);

            // สร้าง Bank ใหม่
            const createbank = await Bank.create({
                bank_name: req.body.bank_name,
                bank_account: req.body.bank_account,
                bank_number: req.body.bank_number,
            });
    
            console.log("Bank creation result:", createbank);

            // ถ้าสร้าง Bank สำเร็จ ทำการสร้าง Business ใหม่
            let createdBusiness = null;
            if (createbank) {
                createdBusiness = await Business.create({
                    bus_name: req.body.bus_name,
                    bus_address: req.body.bus_address,
                    bus_website: req.body.bus_website,
                    bus_tel: req.body.bus_tel,
                    bus_tax: req.body.bus_tax,
                    bus_logo: result.secure_url,
                    bank_id: createbank.bank_id
                });
                console.log("Business creation result:", createdBusiness);
            }
    
            if (createdBusiness) {
                // ใช้ bus_id ของ Business ที่เพิ่งถูกสร้างเพื่อสร้างผู้ใช้ใหม่
                const insertUser = await User.create({
                    userF_name: req.body.userF_name,
                    userL_name: req.body.userL_name,
                    userPhone: req.body.userPhone,
                    userEmail: req.body.userEmail,
                    userPassword: req.body.userPassword,
                    RoleID: 1, 
                    bus_id: createdBusiness.bus_id, 
                });
                console.log("User creation result:", insertUser);
                console.log(req.body);
                return ResponseManager.SuccessResponse(req, res, 200, insertUser);
            } else {
                return ResponseManager.ErrorResponse(req, res, 500, "Failed to create Business");
            }
    
        } catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message);
        }
    }

    static async EditUsers (req, res) {
        try {   
            const editemp = await User.findOne({
                where: {
                    userID: req.params.id,
                  },
            })       
            if(editemp){


                const existingUser = await User.findOne({
                    where: {
                        userEmail: req.body.userEmail,
                        userID: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
                    },
                });
        
                if (existingUser) {
                    return ResponseManager.ErrorResponse(req, res, 400, "User already exists");
      
                }


                await User.update(
                {
                    userF_name: req.body.userF_name,
                    userL_name: req.body.userL_name,
                    userPhone: req.body.userPhone,
                    userEmail: req.body.userEmail,
                    userPassword: req.body.userPassword,
                    RoleID: req.body.RoleID
                },
                {
                    where: {
                        userID: req.params.id,
                    },
                }               
            )
            return ResponseManager.SuccessResponse(req,res,200,"User Updated") 
        }             
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }


    static async GetUsers (req, res) { //add category
        // try {   
        //     let datalist = [];
        //     const Users = await User.findAll();   
        //     User.belongsTo(Role, { foreignKey: "RoleID" });
        //     Role.hasMany(User, { foreignKey: "RoleID" });

        //     var Users_join = await User.findAll({ include: [Role] });
 
        //     return ResponseManager.SuccessResponse(req,res,200,(Users_join))
             
        // }catch (err) {
        //     return ResponseManager.CatchResponse(req, res, err.message)

        // }
        User.belongsTo(Role, { foreignKey: "RoleID" });
        User.belongsTo(Business, { foreignKey: "bus_id" });
        Business.hasMany(User, { foreignKey: "bus_id" });

        const tokenData = await TokenManager.update_token(req);
        if (!tokenData) {
          return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
        }
    
        const { RoleName, userID, userEmail, BusID } = tokenData;


        try {   

            const Users = await User.findAll({
                include: [
                    {
                        model: Role
                    }
                ],
                where: {
                    bus_id: BusID,
                },
            }); 

            return ResponseManager.SuccessResponse(req,res,200,(Users))
             
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }
    static async GetUserByID (req, res) { //add category

        User.belongsTo(Role, { foreignKey: "RoleID" });
        try {   

            const Users = await User.findOne({
                include: [
                    {
                        model: Role
                    }
                ],
                where: {
                    userID: req.params.id,
                },
            }); 

            return ResponseManager.SuccessResponse(req,res,200,(Users))
             
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }
    static async DeleteUsers (req, res) { //add category
        try {   
            const deletecate = await User.findOne({
                where: {
                    userID: req.params.id,
                  },
            })         
                if(deletecate){
                    await User.destroy({
                        where:{
                            userID: req.params.id,
                        }
                    })                                    
                    return ResponseManager.SuccessResponse(req,res,200,"User Deleted")             
                }else{                
                    return ResponseManager.ErrorResponse(req,res,400,"No User found")  
                }                  
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }

    // static async session (req, res, next) { //add category
    //     try {   
    //         if (req.session.views) {
 
    //             // Increment the number of views.
    //             req.session.views++
         
    //             // Session will expires after 3 hour
    //             // of in activity
    //             // res.write('<p> Session expires after 1 min of in activity: ' + (req.session.UserName) + '</p>')

    //               res.json({
    //                     status: 200,
    //                     UserID: req.session.userID,
    //                     UserName: req.session.UserName,
    //                     UserRole: req.session.UserRole,
    //                     RoleName: req.session.RoleName,
    //                     Session_expires_after_3_hour: req.session.cookie.expires,
    //                 })
    //             res.end()
    //         } else {
    //             req.session.views = 1
    //             res.end(' New session is started')
    //         }
    //     }catch (err) {
    //         await ResponseManager.CatchResponse(req, res, err.message)
    //     }
    // }
    // static async getUser (req, res) { //add category
    //     User.belongsTo(Role, { foreignKey: "RoleID" });
    //     try {   

    //         const Users = await User.findAll({
    //             include: [
    //                 {
    //                     model: Role
    //                 }
    //             ]
    //         }); 

    //         return ResponseManager.SuccessResponse(req,res,200,(Users))
             
    //     }catch (err) {
    //         return ResponseManager.CatchResponse(req, res, err.message)
    //     }
    // }

    // static async editUser (req, res) { 
    //     try {   
    //         const editemp = await User.findOne({
    //             where: {
    //                 userID: req.params.id,
    //               },
    //         })       
    //         if(editemp){


    //             const existingUser = await User.findOne({
    //                 where: {
    //                     userEmail: req.body.userEmail,
    //                     userID: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
    //                 },
    //             });
        
    //             if (existingUser) {
    //                 return ResponseManager.ErrorResponse(req, res, 400, "User already exists");
      
    //             }


    //             await User.update(
    //             {
    //                 userF_name: req.body.userF_name,
    //                 userL_name: req.body.userL_name,
    //                 userPhone: req.body.userPhone,
    //                 userEmail: req.body.userEmail,
    //                 userPassword: req.body.userPassword,
    //                 RoleID: req.body.RoleID
    //             },
    //             {
    //                 where: {
    //                     userID: req.params.id,
    //                 },
    //             }               
    //         )
    //         return ResponseManager.SuccessResponse(req,res,200,"User Updated") 
    //     }             
    //     }catch (err) {
    //         return ResponseManager.CatchResponse(req, res, err.message)
    //     }
    // }
    static async forgetPassword (req, res) { 
        try {   
            const editemp = await User.findAll({
                where: {
                    userEmail: req.body.userEmail,
                  },
            })      

            if(editemp){

                const editpassword = await User.findAll({
                    where: {
                        userPassword: req.body.userPassword,
                    },
                })   

                if(editpassword) {
                    return ResponseManager.SuccessResponse(req,res,400,"Password already exists") 
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
                    )
                    return ResponseManager.SuccessResponse(req,res,200,"Password Updated") 
            }
        } else {
            return ResponseManager.ErrorResponse(req,res,400,`Email not found`)
        }             
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }
    static async checkEmail (req, res) { 
        try {   
            const editemp = await User.findOne({
                where: {
                    userEmail: req.body.userEmail,
                  },
            })      

            if(editemp){
                return ResponseManager.SuccessResponse(req,res,200,"correct email") 
            } else {
                return ResponseManager.ErrorResponse(req,res,400,`Email not found`)
            }             
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }
    static async forgetPassword (req, res) { 
        try {   
            const editemp = await User.findOne({
                where: {
                    userEmail: req.body.userEmail,
                  },
            })      
            const user_email = editemp.userEmail 
            if(editemp){

            const editpassword = await User.findOne({
                where: {
                    userPassword: req.body.userPassword,
                  },
            })   

            if(editpassword) {
                return ResponseManager.SuccessResponse(req,res,400,"Password already exists") 
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
                )
                return ResponseManager.SuccessResponse(req,res,200,"Password Updated") 
            }
        } else {
            return ResponseManager.ErrorResponse(req,res,400,`Email ${user_email} not found`)
        }             
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }
    // static async deleteUser (req, res) { //add category
    //     try {   
    //         const deletecate = await User.findOne({
    //             where: {
    //                 userID: req.params.id,
    //               },
    //         })         
    //             if(deletecate){
    //                 await User.destroy({
    //                     where:{
    //                         userID: req.params.id,
    //                     }
    //                 })                                    
    //                 return ResponseManager.SuccessResponse(req,res,200,"User Deleted")             
    //             }else{                
    //                 return ResponseManager.ErrorResponse(req,res,400,"No User found")  
    //             }    
    //     }catch (err) {
    //         return ResponseManager.CatchResponse(req, res, err.message)
    //     }
    // }




    static async GetRole (req, res) { //add category
        try {   

            const Roles = await Role.findAll(); 

            return ResponseManager.SuccessResponse(req,res,200,(Roles))
             
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }


    static async AddRole (req, res) { //add category
        try {   
            const addcate = await Role.findOne({
                where: {
                    RoleName: req.body.RoleName,
                  },
            })         
                if(addcate){
                    return ResponseManager.SuccessResponse(req,res,400,"Role already exists") 
                }else{
                    const insert_cate = await Role.create({
                        RoleName:req.body.RoleName,  
                    })
                    console.log(req.body)
                    return ResponseManager.SuccessResponse(req,res,200,(insert_cate))   
                }   
             
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }

    static async EditRole (req, res) { //add category
        try {   
            const editemp = await Role.findOne({
                where: {
                    RoleID: req.params.id,
                  },
            })       
            if(editemp){


                const existingUser = await Role.findOne({
                    where: {
                        RoleName: req.body.RoleName,
                        RoleID: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
                    },
                });
        
                if (existingUser) {
                    await ResponseManager.ErrorResponse(req, res, 400, "Role already exists");
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
            )
            return ResponseManager.SuccessResponse(req,res,200,"Role Updated") 
        }             
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }

    static async DeleteRole (req, res) { //add category
        try {   
            const deletecate = await Role.findOne({
                where: {
                    RoleID: req.params.id,
                  },
            })         
                if(deletecate){
                    await Role.destroy({
                        where:{
                            RoleID: req.params.id,
                        }
                    })                                    
                    return ResponseManager.SuccessResponse(req,res,200,"Role Deleted")             
                }else{                
                    return ResponseManager.ErrorResponse(req,res,400,"No Role found")  
                }    
        }catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message)
        }
    }
  }
  module.exports = AuthController;