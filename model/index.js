// models/index.js

const sequelize = require("../database");

// --- Import All Models ---
const { User, Role } = require("./userModel");
const { Business, Bank, Customer, Quotation_sale, Quotation_sale_detail, Invoice, Billing, Quotation_img, Company_person, TaxInvoice } = require("./quotationModel");
const { Employee, Position, Salary_pay, Department, Leaving, Overtime } = require("./employeeModel");
const { Product, productType, productCategory, Transaction, Expense } = require("./productModel");

// --- Define All Associations ---

// --- Business Associations ---
Business.hasOne(Bank, { foreignKey: "bank_id" });
Business.hasMany(User, { foreignKey: "business_id" });
Business.hasMany(Employee, { foreignKey: "business_id" });
Business.hasMany(Product, { foreignKey: "business_id" });
Business.hasMany(productCategory, { foreignKey: "business_id" });
Business.hasMany(Expense, { foreignKey: "business_id" });
Business.hasMany(Customer, { foreignKey: "business_id" });
Business.hasMany(Quotation_sale, { foreignKey: "business_id" });
Business.hasMany(Company_person, { foreignKey: "business_id" });

// --- User & Auth Associations ---
User.belongsTo(Role, { foreignKey: "role_id" });
User.belongsTo(Business, { foreignKey: "business_id" });
Role.hasMany(User, { foreignKey: "role_id" });

// --- Employee & HR Associations ---
Employee.belongsTo(Position, { foreignKey: "position_id" });
Employee.belongsTo(Department, { foreignKey: "department_id" });
Employee.belongsTo(Business, { foreignKey: "business_id" });
Employee.hasMany(Quotation_sale, { foreignKey: "employee_id" });
Employee.hasMany(Leaving, { foreignKey: "employee_id" });
Employee.hasMany(Overtime, { foreignKey: "employee_id" });
Employee.hasMany(Salary_pay, { foreignKey: "employee_id" });
Employee.hasMany(Leaving, { foreignKey: "employee_id" });
Leaving.belongsTo(Employee, { foreignKey: "employee_id" });

Department.hasMany(Employee, { foreignKey: "department_id" });
Department.belongsTo(Business, { foreignKey: "business_id" });

Position.hasMany(Employee, { foreignKey: "position_id" });
Position.belongsTo(Business, { foreignKey: "business_id" });

// --- Product & Inventory Associations ---
Product.belongsTo(productCategory, { foreignKey: "category_id" });
Product.belongsTo(productType, { foreignKey: "product_type_id" });
Product.belongsTo(Business, { foreignKey: "business_id" });
Product.hasMany(Transaction, { foreignKey: "product_id" });

productCategory.hasMany(Product, { foreignKey: "category_id" });
productCategory.belongsTo(Business, { foreignKey: "business_id" });
productType.hasMany(Product, { foreignKey: "product_type_id" });

Transaction.belongsTo(Product, { foreignKey: "product_id" });
Expense.belongsTo(Business, { foreignKey: "business_id" });

// --- Customer, Quotation, Invoice, Billing Flow ---
Customer.belongsTo(Business, { foreignKey: "business_id" });
Customer.hasMany(Quotation_sale, { foreignKey: "customer_id" });
Customer.hasMany(Company_person, { foreignKey: "company_person_customer" });

Company_person.belongsTo(Customer, { foreignKey: "company_person_customer" });
Company_person.belongsTo(Business, { foreignKey: "business_id" });

Quotation_sale.belongsTo(Business, { foreignKey: "business_id" });
Quotation_sale.belongsTo(Customer, { foreignKey: "customer_id" });
Quotation_sale.belongsTo(Employee, { foreignKey: "employee_id" });
Quotation_sale.hasMany(Quotation_sale_detail, { foreignKey: "sale_id" });
Quotation_sale.hasOne(Invoice, { foreignKey: "sale_id" });
Quotation_sale.hasOne(Quotation_img, { foreignKey: "quotation_id" });

Quotation_sale_detail.belongsTo(Quotation_sale, { foreignKey: "sale_id" });
Quotation_img.belongsTo(Quotation_sale, { foreignKey: "quotation_id" });

Invoice.belongsTo(Quotation_sale, { foreignKey: "sale_id" });
Invoice.hasOne(Billing, { foreignKey: "invoice_id" });
Invoice.hasOne(TaxInvoice, { foreignKey: "invoice_id" });

TaxInvoice.belongsTo(Invoice, { foreignKey: "invoice_id" });
TaxInvoice.hasOne(Billing, { foreignKey: "tax_invoice_id" });

Billing.belongsTo(Invoice, { foreignKey: "invoice_id" });
Billing.belongsTo(TaxInvoice, { foreignKey: "tax_invoice_id" });

// --- Other Standalone Associations ---
Bank.belongsTo(Business, { foreignKey: "bank_id" });

// --- Export Everything ---
module.exports = {
  sequelize, User, Role, Business, Bank, Customer, Quotation_sale, Quotation_sale_detail,
  Invoice, Billing, Quotation_img, Company_person, TaxInvoice, Employee, Position,
  Salary_pay, Department, Leaving, Overtime, Product, productType, productCategory,
  Transaction, Expense,
};