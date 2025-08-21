const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Product = sequelize.define(
  "products",
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_type_id: {
      type: DataTypes.INTEGER,
    },
    category_id: {
      type: DataTypes.INTEGER,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_detail: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    product_cost: {
      type: DataTypes.DOUBLE,
    },
    product_img: {
      type: DataTypes.STRING(100),
    },
    product_date: {
      type: 'timestamp with time zone',
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_status: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const productType = sequelize.define(
  "product_types",
  {
    product_type_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_type_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const productCategory = sequelize.define(
  "product_categories",
  {
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Transaction = sequelize.define(
  "product_transactions",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transaction_detail: {
      type: DataTypes.STRING,
    },
    quantity_added: {
      type: DataTypes.INTEGER,
    },
    quantity_removed: {
      type: DataTypes.INTEGER,
    },
    transaction_date: {
      type: 'timestamp with time zone',
    },
  },
  {
    timestamps: false,
  }
);

const Expense = sequelize.define(
  "expense",
  {
    expense_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    expense_date: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    expense_category: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    expense_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    quantity_remark: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    expense_image: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Product.belongsTo(productCategory, { foreignKey: "category_id" });
productCategory.hasMany(Product, { foreignKey: "category_id" });

module.exports = {
  Product,
  productType,
  productCategory,
  Transaction,
  Expense,
};
