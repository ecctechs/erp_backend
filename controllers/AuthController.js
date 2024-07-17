// const bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs');
const TokenManager = require('../middleware/tokenManager');
const ResponseManager = require("../middleware/ResponseManager");
const {User, Role } = require('../model/userModel'); // call model
const logUserActivity = require('../middleware/UserActivity');


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
                    await ResponseManager.ErrorResponse(req, res, 401, 'Incorrect username or password');
                }
            } else {
                // ไม่พบผู้ใช้
                await ResponseManager.ErrorResponse(req, res, 404, 'Incorrect username or password');
            }
        } catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message);
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
        try {   
           
            const addcate = await User.findOne({
                where: {
                    userEmail: req.body.userEmail,
                  },
            })         
                if(addcate){
                    await ResponseManager.SuccessResponse(req,res,400,"User already exists") 
                }else{
                    //const hashedPassword = await bcrypt.hash(req.body.userPassword, 10);
                    const insert_cate = await User.create({
                        userF_name:req.body.userF_name, 
                        userL_name:req.body.userL_name,   
                        userPhone:req.body.userPhone,   
                        userEmail:req.body.userEmail,   
                        userPassword:req.body.userPassword,   
                        RoleID:req.body.RoleID,     
                    })
                    console.log(req.body)
                    await ResponseManager.SuccessResponse(req,res,200,(insert_cate))   
                }          
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
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
                await User.update(
                {
                    userF_name: req.body.userF_name,
                    userL_name: req.body.userL_name,
                    userPhone: req.body.userPhone,
                    userEmail: req.body.userEmail,
                    userPassword: req.body.userPassword,
                    RoleID: req.body.RoleID,
                },
                {
                    where: {
                        userID: req.params.id,
                    },
                }               
            )
            await ResponseManager.SuccessResponse(req,res,200,"User Updated")  
        }else{
            await ResponseManager.ErrorResponse(req,res,400,"No User found")  
        }
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
        }
    }


    static async GetUsers (req, res) { //add category
        try {   
            let datalist = [];
            const Users = await User.findAll();   
            User.belongsTo(Role, { foreignKey: "RoleID" });
            Role.hasMany(User, { foreignKey: "RoleID" });

            var Users_join = await User.findAll({ include: [Role] });

            // for (const property in Users) {

            //     const data = {};
            //     data.userID = Users[property].userID;
            //     data.userF_name = Users[property].userF_name;
            //     data.userL_name = Users[property].userL_name;
            //     data.userPhone = Users[property].userPhone;
            //     data.userEmail = Users[property].userEmail;
            //     data.userPassword = Users[property].userPassword;

            //     const Roles = await Role.findAll({
            //         where:{
            //             RoleID: Users[property].RoleID.toString(),
            //         }
            //       }); 

            //       console.log(Roles.length)

            //     if(Roles.length > 0){

            //     data.RoleID = Roles[property].RoleID;
            //     data.RoleName = Roles[property].RoleName;

            //     }else{
            //         data.RoleID = Users[property].RoleID;
            //         data.RoleName = "null";
            //     }

            //     datalist.push(data);  
            // }
 
            await ResponseManager.SuccessResponse(req,res,200,(Users_join))
             
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
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
                    await ResponseManager.SuccessResponse(req,res,200,"User Deleted")             
                }else{                
                    await ResponseManager.ErrorResponse(req,res,400,"No User found")  
                }                  
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
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
    static async getUser (req, res) { //add category
        User.belongsTo(Role, { foreignKey: "RoleID" });
        try {   

            const Users = await User.findAll({
                include: [
                    {
                        model: Role
                    }
                ]
            }); 

            await ResponseManager.SuccessResponse(req,res,200,(Users))
             
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
        }
    }

    static async editUser (req, res) { 
        try {   
            const editemp = await User.findOne({
                where: {
                    userID: req.params.id,
                  },
            })       
            if(editemp){
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
            await ResponseManager.SuccessResponse(req,res,200,"User Updated") 
        }             
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
        }
    }
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
                    await ResponseManager.SuccessResponse(req,res,400,"Password already exists") 
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
                await ResponseManager.SuccessResponse(req,res,200,"Password Updated") 
            }
        } else {
            await ResponseManager.ErrorResponse(req,res,400,`Email not found`)
        }             
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
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
                await ResponseManager.SuccessResponse(req,res,200,"correct email") 
            } else {
                await ResponseManager.ErrorResponse(req,res,400,`Email not found`)
            }             
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
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
                await ResponseManager.SuccessResponse(req,res,400,"Password already exists") 
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
            await ResponseManager.SuccessResponse(req,res,200,"Password Updated") 
            }
        } else {
            await ResponseManager.ErrorResponse(req,res,400,`Email ${user_email} not found`)
        }             
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
        }
    }
    static async deleteUser (req, res) { //add category
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
                    await ResponseManager.SuccessResponse(req,res,200,"User Deleted")             
                }else{                
                    await ResponseManager.ErrorResponse(req,res,400,"No User found")  
                }    
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
        }
    }




    static async GetRole (req, res) { //add category
        try {   

            const Roles = await Role.findAll(); 

            await ResponseManager.SuccessResponse(req,res,200,(Roles))
             
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
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
                    await ResponseManager.SuccessResponse(req,res,400,"Role already exists") 
                }else{
                    const insert_cate = await Role.create({
                        RoleName:req.body.RoleName,  
                    })
                    console.log(req.body)
                    await ResponseManager.SuccessResponse(req,res,200,(insert_cate))   
                }   
             
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
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
            await ResponseManager.SuccessResponse(req,res,200,"Role Updated") 
        }             
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
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
                    await ResponseManager.SuccessResponse(req,res,200,"Role Deleted")             
                }else{                
                    await ResponseManager.ErrorResponse(req,res,400,"No Role found")  
                }    
        }catch (err) {
            await ResponseManager.CatchResponse(req, res, err.message)
        }
    }
  }
  module.exports = AuthController;