const { DataTypes } = require('sequelize');
const sequelize = require('../database');


// get data by select 'products' that is table from DB
const User = sequelize.define('users', {

    // set column from DB
    userID: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true,      
        primaryKey: true
    },
    userF_name: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    userL_name: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    userPhone: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    userEmail: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    userPassword: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    RoleID:{
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    accessToken:{
      type: DataTypes.STRING, 
    },
  TokenCreate:{
      type: DataTypes.STRING, 
  },
  bus_id:{
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
},{
    timestamps: false
})

// const User = sequelize.define('users', {

//     // set column from DB
//     userID: { 
//         type: DataTypes.INTEGER, 
//         autoIncrement: true,      
//         primaryKey: true
//     },
//     userF_name: {
//         type: DataTypes.STRING, 
//         allowNull: false 
//     },
//     userL_name: {
//         type: DataTypes.STRING, 
//         allowNull: false 
//     },
//     userPhone: {
//         type: DataTypes.STRING, 
//         allowNull: false 
//     },
//     userEmail: {
//         type: DataTypes.STRING, 
//         allowNull: false 
//     },
//     userPassword: {
//         type: DataTypes.STRING, 
//         allowNull: false 
//     },
//     RoleID:{
//         type: DataTypes.INTEGER, 
//         allowNull: false 
//     }
// })

const Role = sequelize.define('roles', {

    // set column from DB
    RoleID: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true,      
        primaryKey: true
    },
    RoleName: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
},{
    timestamps: false
})

// const UserActivity = sequelize.define('UserActivity', {
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     action: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     asset: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//     timestamp: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   });

const UserActivity = sequelize.define('UserActivities', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    routeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },{
    timestamps: false
})

  


module.exports = {User,Role,UserActivity};