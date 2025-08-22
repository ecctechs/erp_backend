const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Business = sequelize.define(
  "businesses",
  {
    bus_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    business_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    business_address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    business_website: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    business_tax: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    business_tel: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    business_logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

const Bank = sequelize.define(
  "banks",
  {
    bank_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bank_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    bank_account: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    bank_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Customer = sequelize.define(
  "customers",
  {
    customer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    customer_address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    customer_tel: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    cus_email: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    cus_tax: {
      type: DataTypes.STRING(13),
      allowNull: false,
    },
    cus_purchase: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customer_status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Quotation_sale = sequelize.define(
  "quotation_sales",
  {
    sale_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sale_number: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    sale_date: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    credit_date_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    credit_expired_date: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    sale_totalprice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    discount_quotation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    vatType: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    remarkInfernal: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

const Quotation_sale_detail = sequelize.define(
  "quotation_sale_details",
  {
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sale_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    sale_discount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    sale_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discounttype: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    product_detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pro_unti: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Invoice = sequelize.define(
  "invoices",
  {
    invoice_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoice_number: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    invoice_date: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    invoice_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING(355),
      allowNull: true,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

const TaxInvoice = sequelize.define(
  "tax_invoices",
  {
    tax_invoice_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tax_invoice_number: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    tax_invoice_date: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tax_invoice_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    tax_invoice_remark: {
      type: DataTypes.STRING(355),
      allowNull: true,
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

const Billing = sequelize.define(
  "billings",
  {
    billing_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    billing_number: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    billing_date: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    billing_status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    payments: {
      type: DataTypes.STRING(35),
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING(105),
      allowNull: true,
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tax_invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);
const Quotation_img = sequelize.define(
  "quotation_img",
  {
    quotation_id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    quotation_img: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Company_person = sequelize.define(
  "company_person",
  {
    company_person_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_person_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    company_person_address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    company_person_tel: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    company_person_email: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    company_person_customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_person_status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  Business,
  Bank,
  Customer,
  Quotation_sale,
  Quotation_sale_detail,
  Invoice,
  Billing,
  Quotation_img,
  Company_person,
  TaxInvoice,
};
