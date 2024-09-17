const { DataTypes } = require('sequelize');
const sequelize = require('../database');


//get data by select 'products' that is table from DB
const Employee = sequelize.define('employees', {

    // set column from DB
    employeeID: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    F_name: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    L_name: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    Address: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    Birthdate: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    NID_num: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    Phone_num: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    Email: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    start_working_date: {
        type: DataTypes.DATE, 
        allowNull: false 
    },
    Salary: {
        type: DataTypes.FLOAT, 
        allowNull: false 
    },
    employeeType: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    bankName: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    bankAccountID: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    PositionID: {
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    departmentID: {
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    bus_id: {
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
},{
    timestamps: false
})

const Position = sequelize.define( 'positions', {
    PositionID: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true       
    },
    Position: {
        type: DataTypes.STRING, 
        allowNull: false       
    },
    bus_id: {
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
},{
    timestamps: false
});

const Salary_pay = sequelize.define( 'salary_payments', {
    payment_id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true       
    },
    Date: {
        type: DataTypes.STRING, 
        allowNull: false       
    },
    round: {
        type: DataTypes.INTEGER, 
        allowNull: false       
    },
    month: {
        type: DataTypes.STRING, 
        allowNull: false       
    },
    year: {
        type: DataTypes.STRING, 
        allowNull: false       
    },
    employeeID: {
        type: DataTypes.INTEGER,
        allowNull: false       
    },
    bus_id: {
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
},{
    timestamps: false
});

const Leaving = sequelize.define( 'leavings', {
    leaving_id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true       
    },
    date: {
        type: DataTypes.STRING, 
        allowNull: false       
    },
    detail: {
        type: DataTypes.STRING, 
        allowNull: false       
    },
    employeeID: {
        type: DataTypes.INTEGER,
        allowNull: false       
    },
},{
    timestamps: false
});

const Overtime = sequelize.define( 'overtimes', {
    overtime_id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true       
    },
    date: {
        type: DataTypes.STRING, 
        allowNull: false       
    },
    detail: {
        type: DataTypes.STRING, 
        allowNull: false       
    },
    employeeID: {
        type: DataTypes.INTEGER,
        allowNull: false       
    },
    hours: {
        type: DataTypes.INTEGER,
        allowNull: false  
    }
},{
    timestamps: false
});

const Department = sequelize.define( 'departments', {
    departmentID: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true       
    },
    departmentName: {
        type: DataTypes.STRING,
        allowNull: false       
    },
    bus_id: {
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
},{
    timestamps: false
});

Employee.belongsTo(Position, { foreignKey: "PositionID" });
Position.hasMany(Employee, { foreignKey: "PositionID" });


module.exports = {Employee,Position,Salary_pay,Department,Leaving,Overtime};