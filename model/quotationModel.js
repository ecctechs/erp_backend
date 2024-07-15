const { DataTypes } = require('sequelize');
const sequelize = require('../database');


const Business = sequelize.define( 'businesses', {
    bus_id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true       
    },
    bus_name: {
        type: DataTypes.STRING(40), 
        allowNull: false       
    },
    bus_address: {
        type: DataTypes.STRING(100), 
        allowNull: false       
    },
    bus_website: {
        type: DataTypes.STRING(40),  
        allowNull: false       
    },
    bus_tax: {
        type: DataTypes.STRING(13),  
        allowNull: false    
    },
    bus_tel: {
        type: DataTypes.STRING(10), 
        allowNull: false      
    },
    bus_logo: {
        type: DataTypes.STRING,   
        allowNull: false  
    },
    bank_id:{
        type: DataTypes.INTEGER, 
    }
},{
    timestamps: false
});

const Bank = sequelize.define( 'banks', {
    bank_id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true  
    },
    bank_name: {
        type: DataTypes.STRING(40), 
        allowNull: false       
    },
    bank_account: {
        type: DataTypes.STRING(40), 
        allowNull: false       
    },
    bank_number: {
        type: DataTypes.STRING(10),  
        allowNull: false       
    },
},{
    timestamps: false
});

const Customer = sequelize.define( 'customers', {
    cus_id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true       
    },
    cus_name: {
        type: DataTypes.STRING(40), 
        allowNull: false       
    },
    cus_address: {
        type: DataTypes.STRING(100), 
        allowNull: false       
    },
    cus_tel: {
        type: DataTypes.STRING(10),  
        allowNull: false       
    },
    cus_email: {
        type: DataTypes.STRING(40),  
        allowNull: false       
    },
    cus_tax: {
        type: DataTypes.STRING(13),  
        allowNull: false       
    },
    cus_purchase: {
        type: DataTypes.STRING(40),  
        allowNull: false       
    },
},{
    timestamps: false
});

const Quotation_sale = sequelize.define( 'quotation_sales', {
    sale_id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true       
    },
    sale_number: {
        type: DataTypes.STRING(40), 
        allowNull: false       
    },
    sale_date: {
        type: DataTypes.STRING(100), 
        allowNull: false       
    },
    credit_date_number: {
        type: DataTypes.STRING(10),  
        allowNull: false       
    },
    credit_expired_date: {
        type: DataTypes.STRING(40),  
        allowNull: false       
    },
    sale_totalprice: {
        type: DataTypes.DOUBLE,  
        allowNull: false       
    },
    bus_id: {
        type: DataTypes.INTEGER,  
        allowNull: false       
    },
    cus_id: {
        type: DataTypes.INTEGER, 
        allowNull: false       
    },
    employeeID: {
        type: DataTypes.INTEGER,  
        allowNull: false       
    },
},{
    timestamps: false
});

const Quotation_sale_detail = sequelize.define( 'quotation_sale_details', {
    sale_id: {
        type: DataTypes.INTEGER, 
        allowNull: false      
    },
    productID: {
        type: DataTypes.INTEGER,  
        allowNull: false       
    },
    sale_price: {
        type: DataTypes.INTEGER,  
        allowNull: false       
    },
    sale_discount: {
        type: DataTypes.INTEGER, 
        allowNull: false       
    },
    sale_qty: {
        type: DataTypes.INTEGER,  
        allowNull: false       
    },
},{
    timestamps: false
});

module.exports = {Business,Bank,Customer,Quotation_sale,Quotation_sale_detail};