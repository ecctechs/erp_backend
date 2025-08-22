const ResponseManager = require("../middleware/ResponseManager");
const { cloudinary } = require("../utils/cloudinary");
const { Op } = require("sequelize");
const TokenManager = require("../middleware/tokenManager");
const sequelize = require("../database");
const reportQueries = require("../queries/report_queries");
const quotationQueries = require("../queries/quotation_queries");

const {
  Business, Bank, Customer, Quotation_sale, Quotation_sale_detail,
  Invoice, Billing, Quotation_img, Company_person, TaxInvoice,
  Employee, User, Expense
} = require("../model");

class QuotationSaleController {
  static async getBusiness(req, res) {
    try {
      Business.hasMany(Bank, { foreignKey: "bank_id" });

      const business = await Business.findAll({
        include: [
          {
            model: Bank,
          },
        ],
      });

      return ResponseManager.SuccessResponse(req, res, 200, business);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getCustomer(req, res) {
    try {
      const { bus_id } = req.userData;

      const customer = await Customer.findAll({
        where: { bus_id: bus_id },
      });

      return ResponseManager.SuccessResponse(req, res, 200, customer);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  
  static async addCustomer(req, res) {
    try {
      const { bus_id } = req.userData;

      const addCustomer = await Customer.findOne({
        where: {
          customer_name: req.body.customer_name,
          bus_id: bus_id,
        },
      });
      if (addCustomer) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Customer already exists"
        );
      }

      const addCustomerPhone = await Customer.findOne({
        where: {
          customer_tel: req.body.customer_tel,
          bus_id: bus_id,
        },
      });
      if (addCustomerPhone) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Customer Contact already exists"
        );
      }

      const addCustomerTax = await Customer.findOne({
        where: {
          customer_tax: req.body.customer_tax,
          bus_id: bus_id,
        },
      });
      if (addCustomerTax) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Customer tax already exists"
        );
      }
      const insert_cate = await Customer.create({
        customer_name: req.body.customer_name,
        customer_address: req.body.customer_address,
        customer_tel: req.body.customer_tel,
        customer_email: req.body.customer_email,
        customer_tax: req.body.customer_tax,
        cus_purchase: req.body.cus_purchase,
        bus_id: bus_id,
        customer_status: "active",
      });

      return ResponseManager.SuccessResponse(req, res, 200, insert_cate);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async editCompany(req, res) {
    try {
      const editemp = await Company_person.findOne({
        where: {
          company_person_id: req.params.id,
        },
      });
      if (editemp) {
        const existingUser = await Company_person.findOne({
          where: {
            company_person_name: req.body.company_person_name,
            company_person_id: { [Op.ne]: req.params.id },
          },
        });

        if (existingUser) {
          await ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "Customer already exists"
          );
          return;
        }
        await Company_person.update(
          {
            company_person_name: req.body.company_person_name,
            company_person_address: req.body.company_person_address,
            company_person_tel: req.body.company_person_tel,
            company_person_email: req.body.company_person_email,
            company_person_customer: req.body.company_person_customer,
          },
          {
            where: {
              company_person_id: req.params.id,
            },
          }
        );
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Customer Updated"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async editCustomer(req, res) {
    try {
      const editemp = await Customer.findOne({
        where: {
          customer_id: req.params.id,
        },
      });
      if (editemp) {
        const existingUser = await Customer.findOne({
          where: {
            customer_name: req.body.customer_name,
            customer_id: { [Op.ne]: req.params.id },
          },
        });

        if (existingUser) {
          await ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "Customer already exists"
          );
          return;
        }

        const addCustomerPhone = await Customer.findOne({
          where: {
            customer_tel: req.body.customer_tel,
            customer_id: { [Op.ne]: req.params.id },
          },
        });
        if (addCustomerPhone) {
          return ResponseManager.SuccessResponse(
            req,
            res,
            400,
            "Customer Contact already exists"
          );
        }

        const addCustomerTax = await Customer.findOne({
          where: {
            customer_tax: req.body.customer_tax,
            customer_id: { [Op.ne]: req.params.id },
          },
        });
        if (addCustomerTax) {
          return ResponseManager.SuccessResponse(
            req,
            res,
            400,
            "Customer tax already exists"
          );
        }

        await Customer.update(
          {
            customer_name: req.body.customer_name,
            customer_address: req.body.customer_address,
            customer_tel: req.body.customer_tel,
            customer_email: req.body.customer_email,
            customer_tax: req.body.customer_tax,
            cus_purchase: req.body.cus_purchase,
          },
          {
            where: {
              customer_id: req.params.id,
            },
          }
        );
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Customer Updated"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async deleteCustomer(req, res) {
    try {
      const deleteproduct = await Customer.findOne({
        where: {
          customer_id: req.params.id,
        },
      });
      if (deleteproduct) {

        const updatedData = {
          customer_status: "not active",
        };

        await Customer.update(updatedData, {
          where: {
            customer_id: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Customer Deleted"
        );
      } else {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Customer found"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async deleteCompany(req, res) {
    try {
      const deleteproduct = await Company_person.findOne({
        where: {
          company_person_id: req.params.id,
        },
      });
      if (deleteproduct) {

        const updatedData = {
          company_person_status: "not active",
        };

        await Company_person.update(updatedData, {
          where: {
            company_person_id: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Customer Deleted"
        );
      } else {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Customer found"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async addBusiness(req, res) {
    try {
      const checkBusiness = await Business.findOne({
        where: {
          business_name: req.body.business_name,
        },
      });
      if (!checkBusiness) {
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
          res.status(400).json({ error: "File size exceeds 5 MB limit" });
        }
        const result = await cloudinary.uploader.upload(req.file.path);

        const createbank = await Bank.create({
          bank_name: req.body.bank_name,
          bank_account: req.body.bank_account,
          bank_number: req.body.bank_number,
        });
        if (createbank) {
          await Business.create({
            business_name: req.body.business_name,
            business_address: req.body.business_address,
            business_website: req.body.business_website,
            business_tel: req.body.business_tel,
            business_tax: req.body.business_tax,
            business_logo: result.secure_url,
            bank_id: createbank.bank_id,
          });
        }
        return ResponseManager.SuccessResponse(req, res, 200, "Success");
      } else {
        let productUpdateData = {
          business_name: req.body.business_name,
          business_address: req.body.business_address,
          business_website: req.body.business_website,
          business_tax: req.body.business_tax,
          business_tel: req.body.business_tel,
          bank_name: req.body.bank_name,
          bank_account: req.body.bank_account,
          bank_number: req.body.bank_number,
        };

        if (req.file) {
          const allowedMimeTypes = ["image/jpeg", "image/png"];

          if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return ResponseManager.ErrorResponse(
              req,
              res,
              400,
              "Only JPEG and PNG image files are allowed"
            );
          }

          else if (req.file.size > 5 * 1024 * 1024) {
            return ResponseManager.ErrorResponse(
              req,
              res,
              400,
              "File size exceeds 5 MB limit"
            );
          }

          const result = await cloudinary.uploader.upload(req.file.path);
          productUpdateData.business_logo = result.secure_url;
        }

        await Business.update(productUpdateData, {
          where: {
            bus_id: 1,
          },
        });
        await Bank.update(productUpdateData, {
          where: {
            bank_id: 1,
          },
        });
        return ResponseManager.SuccessResponse(req, res, 200, "Success");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  
  static async addQuotationSale(req, res) {
    try {
      const { bus_id } = req.userData;

      const existQuatationSale = await Quotation_sale.findOne({
        where: {
          sale_number: req.body.sale_number,
          bus_id: bus_id,
        },
      });

      if (existQuatationSale) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "Quotation already exists"
        );
      }

      const existCustomer = await Customer.findOne({
        where: {
          customer_id: req.body.customer_id,
          bus_id: bus_id,
        },
      });

      if (!existCustomer) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Customer found"
        );
      }

      const insert_Quo = await Quotation_sale.create({
        sale_number: req.body.sale_number,
        sale_date: req.body.sale_date,
        credit_date_number: req.body.credit_date_number,
        credit_expired_date: req.body.credit_expired_date,
        sale_totalprice: req.body.sale_totalprice,
        bus_id: req.body.bus_id,
        customer_id: req.body.customer_id,
        employee_id: req.body.employee_id,
        status: req.body.status,
        remark: req.body.remark,
        remarkInfernal: req.body.remarkInfernal,
        discount_quotation: req.body.discount_quotation,
        vatType: req.body.vatType,
      });

      const products = req.body.products;
      for (let i = 0; i < products.length; i++) {
        products[i].sale_id = insert_Quo.sale_id;
      }
      await Quotation_sale_detail.bulkCreate(products);

      return ResponseManager.SuccessResponse(req, res, 200, insert_Quo);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async editQuotationSale(req, res) {
    try {
      const { bus_id } = req.userData;
      const existQuatationSale = await Quotation_sale.findOne({
        where: {
          sale_id: req.params.id,
        },
      });

      if (existQuatationSale) {
        const existingQuo = await Quotation_sale.findOne({
          where: {
            sale_number: req.body.sale_number,
            sale_id: { [Op.ne]: req.params.id },
            bus_id: bus_id,
          },
        });

        if (existingQuo) {
          await ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "Quotation already exists"
          );
          return;
        }
      }

      if (req.body.status === "Allowed") {
        const today = new Date();
        const invoiceDateStr = today.toISOString().split("T")[0];
        const lastInvoice = await Invoice.findOne({
          include: {
            model: Quotation_sale,
            where: { bus_id },
          },
          order: [["invoice_number", "DESC"]],
        });

        const QuotationOfInvoice = await Invoice.findOne({
          where: {
            sale_id: req.params.id,
          },
        });

        let newInvoiceNumber = "";
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const todayPrefix = `${yy}${mm}${dd}`; // เช่น 250424

        if (!lastInvoice || !lastInvoice.invoice_number) {
          newInvoiceNumber = `IN-${todayPrefix}0001`;
        } else {
          const lastDatePart = lastInvoice.invoice_number.slice(3, 9);
          const lastNumberPart = lastInvoice.invoice_number.slice(9);

          let nextNumber = 1;

          if (lastDatePart === todayPrefix) {
            nextNumber = parseInt(lastNumberPart) + 1;
          }

          const nextNumberStr = String(nextNumber).padStart(4, "0");
          newInvoiceNumber = `IN-${todayPrefix}${nextNumberStr}`;
        }

        if (!QuotationOfInvoice) {
          await Invoice.create({
            invoice_number: newInvoiceNumber,
            invoice_date: invoiceDateStr,
            invoice_status: "Pending",
            remark: "",
            sale_id: req.params.id,
          });

          await Quotation_sale.update(
            {
              deleted_at: new Date().toISOString(),
            },
            {
              where: {
                sale_id: req.params.id,
                bus_id: bus_id,
              },
            }
          );
        }
      }

      await Quotation_sale.update(
        {
          sale_date: req.body.sale_date,
          credit_date_number: req.body.credit_date_number,
          credit_expired_date: req.body.credit_expired_date,
          sale_totalprice: req.body.sale_totalprice,
          bus_id: req.body.bus_id,
          customer_id: req.body.customer_id,
          employee_id: req.body.employee_id,
          status: req.body.status,
          remark: req.body.remark,
          remarkInfernal: req.body.remarkInfernal,
          discount_quotation: req.body.discount_quotation,
          vatType: req.body.vatType,
        },
        {
          where: {
            sale_id: req.params.id,
            bus_id: bus_id,
          },
        }
      );

      const products = req.body.products;

      await Quotation_sale_detail.destroy({
        where: {
          sale_id: req.params.id,
        },
      });

      for (let i = 0; i < products.length; i++) {
        products[i].sale_id = req.params.id; // ใช้ sale_id ที่ส่งเข้ามา
        await Quotation_sale_detail.create(products[i]);
      }

      return ResponseManager.SuccessResponse(req, res, 200, "Quotation Saved");
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getQuotation(req, res) {
    try {
      const { bus_id } = req.userData;

      let result = [];
      let quotationslist = [];

      quotationslist = await Quotation_sale.findAll({
        include: [
          { model: Quotation_sale_detail },
          { model: Employee },
          { model: Customer },
          { model: Business, include: [Bank] },
          { model: Invoice },
        ],
        where: { bus_id: bus_id },
        order: [["sale_number", "ASC"]], // <-- เรียงจากน้อยไปมาก
      });
      const today = new Date();

      for (let log of quotationslist) {
        const expiredDate = new Date(log.credit_expired_date);

        if (today > expiredDate) {
          log.status = "expired";

          await Quotation_sale.update(
            { status: "expired" },
            { where: { sale_id: log.sale_id } }
          );
        }

        result.push({
          sale_id: log.sale_id,
          quotation_num: log.sale_number,
          status: log.status,
          employee_id: log.employee_id,
          employee_name: log.employee.first_name + " " + log.employee.last_name,
          customer_id: log.customer_id,
          customer_name: log.customer.customer_name,
          customer_address: log.customer.customer_address,
          customer_tel: log.customer.customer_tel,
          customer_email: log.customer.customer_email,
          customer_tax: log.customer.customer_tax,
          cus_purchase: log.customer.cus_purchase,
          quotation_start_date: log.sale_date,
          credit_date: log.credit_date_number,
          quotation_expired_date: log.credit_expired_date,
          sale_totalprice: log.sale_totalprice,
          remark: log.remark,
          remarkInfernal: log.remarkInfernal,
          discount_quotation: log.discount_quotation,
          vatType: log.vatType,
          vat: log.vat,
          deleted_at: log.deleted_at,
          invoice:
            !log.invoice || log.status !== "Allowed"
              ? "Pending"
              : log.invoice.invoice_number,
          //
          details: log.quotation_sale_details.map((detail) => ({
            sale_id: detail.sale_id,
            product_id: detail.product_id,
            sale_price: detail.sale_price,
            discounttype: detail.discounttype,
            sale_discount: detail.sale_discount,
            sale_qty: detail.sale_qty,
            product_detail: detail.product_detail,
            pro_unti: detail.pro_unti,
          })),
        });
      }

      return ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getInvoice(req, res) {
    try {
      let result = [];

      const { bus_id } = req.userData;

      //  เรียกใช้ query สำหรับดึงข้อมูลหลัก
      const log = await sequelize.query(
        quotationQueries.GET_INVOICES,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { bus_id },
        }
      );

      //  เรียกใช้ query สำหรับดึงรายละเอียดสินค้า
      const product_detail = await sequelize.query(
        quotationQueries.GET_ALL_QUOTATION_DETAILS,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      log.forEach((sale) => {
        const saleData = {
          sale_id: sale.sale_id,
          quotation_num: sale.sale_number,
          status: sale.status,
          employee_id: sale.employee_id,
          employee_name: `${sale.first_name} ${sale.last_name}`,
          customer_id: sale.customer_id,
          customer_name: sale.customer_name,
          customer_address: sale.customer_address,
          customer_tel: sale.customer_tel,
          customer_email: sale.customer_email,
          customer_tax: sale.customer_tax,
          cus_purchase: sale.cus_purchase,
          quotation_start_date: sale.sale_date,
          credit_date: sale.credit_date_number,
          quotation_expired_date: sale.credit_expired_date,
          sale_totalprice: sale.sale_totalprice,
          invoice_id: sale.invoice_id,
          invoice_number: sale.invoice_number,
          invoice_status: sale.invoice_status,
          invoice_date: sale.invoice_date,
          invoice_remark: sale.invoices_remark,
          vatType: sale.vatType,
          discount_quotation: sale.discount_quotation,
          deleted_at: sale.invoice_deleted_at,
          billing:
            sale.invoice_status !== "Issue a receipt"
              ? "Pending"
              : sale.billing_number,
          details: [],
        };

        // Filter product details for the current sale
        const saleDetails = product_detail.filter(
          (detail) => detail.sale_id === sale.sale_id
        );
        saleDetails.forEach((detail) => {
          saleData.details.push({
            sale_id: detail.sale_id,
            product_id: detail.product_id,
            sale_price: detail.sale_price,
            discounttype: detail.discounttype,
            sale_discount: detail.sale_discount,
            sale_qty: detail.sale_qty,
            product_detail: detail.product_detail,
            pro_unti: detail.pro_unti,
          });
        });

        // Add the complete sale data to the result
        result.push(saleData);
      });

      return ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getTaxInvoice(req, res) {

    try {
      let result = [];

      const { bus_id } = req.userData;

      //  ใช้ query ที่ import เข้ามา สำหรับดึงข้อมูลหลัก
      const log = await sequelize.query(
        quotationQueries.GET_TAX_INVOICES,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { bus_id },
        }
      );
      
      //  ใช้ query ที่ import เข้ามา สำหรับดึงรายละเอียดสินค้า
      const product_detail = await sequelize.query(
        quotationQueries.GET_ALL_QUOTATION_DETAILS,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      log.forEach((sale) => {
        const saleData = {
          tax_invoice_id: sale.tax_id_alias,
          sale_id: sale.sale_id_alias,
          quotation_num: sale.sale_number,
          tax_invoice_number: sale.tax_invoice_number,
          tax_invoice_date: sale.tax_invoice_date,
          tax_invoice_status: sale.tax_invoice_status,
          tax_invoice_remark: sale.tax_invoice_remark,
          status: sale.status,
          employee_id: sale.employee_id,
          employee_name: `${sale.first_name} ${sale.last_name}`,
          customer_id: sale.customer_id,
          customer_name: sale.customer_name,
          customer_address: sale.customer_address,
          customer_tel: sale.customer_tel,
          customer_email: sale.customer_email,
          customer_tax: sale.customer_tax,
          cus_purchase: sale.cus_purchase,
          quotation_start_date: sale.sale_date,
          credit_date: sale.credit_date_number,
          quotation_expired_date: sale.credit_expired_date,
          sale_totalprice: sale.sale_totalprice,
          invoice_id: sale.invoice_id_alias,
          invoice_number: sale.invoice_number,
          invoice_status: sale.invoice_status,
          invoice_date: sale.invoice_date,
          invoice_remark: sale.remark,
          vatType: sale.vatType,
          deleted_at: sale.tax_invoice_deleted_at,
          discount_quotation: sale.discount_quotation,
          billing:
            sale.invoice_status !== "Issue a receipt"
              ? "Pending"
              : sale.billing_number,
          details: [],
        };

        // Filter product details for the current sale
        const saleDetails = product_detail.filter(
          (detail) => detail.sale_id === sale.sale_id
        );
        saleDetails.forEach((detail) => {
          saleData.details.push({
            sale_id: detail.sale_id,
            product_id: detail.product_id,
            sale_price: detail.sale_price,
            discounttype: detail.discounttype,
            sale_discount: detail.sale_discount,
            sale_qty: detail.sale_qty,
            product_detail: detail.product_detail,
            pro_unti: detail.pro_unti,
          });
        });
        // Add the complete sale data to the result
        result.push(saleData);
      });

      return ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async editTaxInvoice(req, res) {
    try {
      const { bus_id } = req.userData;

      const existQuatationSale = await TaxInvoice.findOne({
        where: {
          invoice_id: req.params.id,
        },
      });

      if (req.body.invoice_status === "Issue a receipt") {
        const today = new Date();
        const BillingDateStr = today.toISOString().split("T")[0];

        const [lastBilling] = await sequelize.query(`
          SELECT billings.*
          FROM billings
          LEFT JOIN invoices ON invoices.invoice_id = billings.invoice_id
          LEFT JOIN quotation_sales ON quotation_sales.sale_id = invoices.sale_id
          WHERE quotation_sales.bus_id = '${bus_id}'
          ORDER BY billings.billing_number DESC
          LIMIT 1
        `);

        const billingOfInvoice = await Billing.findOne({
          where: {
            invoice_id: req.params.id,
          },
        });

        let newBillingNumber = "";

        // สร้าง prefix วันที่แบบ yyMMdd
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const todayPrefix = `${yy}${mm}${dd}`; // เช่น 250424

        if (
          !lastBilling ||
          lastBilling.length === 0 ||
          !lastBilling[0].billing_number
        ) {
          newBillingNumber = `BI-${todayPrefix}0001`;
        } else {
          const lastCode = lastBilling[0].billing_number; // เช่น BI-2504240003
          const lastDatePart = lastCode.slice(3, 9);
          const lastNumberPart = lastCode.slice(9);

          let nextNumber = 1;

          if (lastDatePart === todayPrefix) {
            nextNumber = parseInt(lastNumberPart) + 1;
          }

          const nextNumberStr = String(nextNumber).padStart(4, "0");
          newBillingNumber = `BI-${todayPrefix}${nextNumberStr}`;
        }

        if (!billingOfInvoice) {
          await Billing.create({
            billing_number: newBillingNumber,
            billing_date: BillingDateStr,
            billing_status: "Complete",
            payments: "Cash",
            remark: "",
            invoice_id: req.params.id,
            tax_invoice_id: req.body.tax_invoice_id,
            sale_id: req.body.sale_id,
          });

          await TaxInvoice.update(
            {
              deleted_at: new Date().toISOString(),
            },
            {
              where: {
                invoice_id: req.params.id,
              },
            }
          );
        }
      }

      await sequelize.query(`
        UPDATE tax_invoices
        SET tax_invoice_date = '${req.body.invoice_date}',
            tax_invoice_status = '${req.body.invoice_status}',
            tax_invoice_remark = '${req.body.remark}'
        FROM quotation_sales
        WHERE tax_invoices.invoice_id = '${req.params.id}'
          AND quotation_sales.sale_id = tax_invoices.sale_id
          AND quotation_sales.bus_id = '${req.userData.bus_id}'
      `);

      return ResponseManager.SuccessResponse(req, res, 200, "Invoice Saved");
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async deleteTaxInvoice(req, res) {
    try {
      const deleteqto = await TaxInvoice.findOne({
        where: {
          invoice_id: req.params.id,
        },
      });
      if (deleteqto) {
        await TaxInvoice.destroy({
          where: {
            invoice_id: req.params.id,
          },
        });
        await Billing.destroy({
          where: {
            invoice_id: req.params.id,
          },
        });

        await Invoice.update(
          {
            invoice_status: "Pending",
            deleted_at: "",
          },
          {
            where: {
              invoice_id: req.params.id,
            },
          }
        );
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Invoice Deleted"
        );
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No Invoice found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async editInvoice(req, res) {
    try {
      const { bus_id } = req.userData;

      const existQuatationSale = await Invoice.findOne({
        where: {
          invoice_id: req.params.id,
        },
      });

      if (existQuatationSale) {
        const existingQuo = await Invoice.findOne({
          where: {
            invoice_number: req.body.invoice_number,
            invoice_id: { [Op.ne]: req.params.id },
          },
          include: {
            model: Quotation_sale,
            where: { bus_id },
          },
        });

        if (existingQuo) {
          await ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "Invoice already exists"
          );
          return;
        }
      }

      if (req.body.invoice_status === "Issue a receipt") {
        const today = new Date();
        const BillingDateStr = today.toISOString().split("T")[0];

        const [lastBilling] = await sequelize.query(`
          SELECT tax_invoices.*
          FROM tax_invoices
          LEFT JOIN invoices ON invoices.invoice_id = tax_invoices.invoice_id
          LEFT JOIN quotation_sales ON quotation_sales.sale_id = invoices.sale_id
          WHERE quotation_sales.bus_id = '${bus_id}'
          ORDER BY tax_invoices.tax_invoice_number DESC
          LIMIT 1
        `);

        const billingOfInvoice = await TaxInvoice.findOne({
          where: {
            invoice_id: req.params.id,
          },
        });

        const Invoice_quotataion = await Invoice.findOne({
          where: {
            invoice_id: req.params.id,
          },
        });

        let newBillingNumber = "";

        // สร้าง prefix วันที่แบบ yyMMdd
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const todayPrefix = `${yy}${mm}${dd}`; // เช่น 250424

        if (
          !lastBilling ||
          lastBilling.length === 0 ||
          !lastBilling[0].tax_invoice_number
        ) {
          newBillingNumber = `IV-${todayPrefix}0001`;
        } else {
          const lastCode = lastBilling[0].tax_invoice_number; // เช่น BI-2504240003
          const lastDatePart = lastCode.slice(3, 9);
          const lastNumberPart = lastCode.slice(9);

          let nextNumber = 1;

          if (lastDatePart === todayPrefix) {
            nextNumber = parseInt(lastNumberPart) + 1;
          }

          const nextNumberStr = String(nextNumber).padStart(4, "0");
          newBillingNumber = `IV-${todayPrefix}${nextNumberStr}`;
        }

        if (!billingOfInvoice) {
          await TaxInvoice.create({
            tax_invoice_number: newBillingNumber,
            tax_invoice_date: BillingDateStr,
            tax_invoice_status: "Pending",
            tax_invoice_remark: "",
            invoice_id: req.params.id,
            sale_id: Invoice_quotataion.sale_id,
          });

          await Invoice.update(
            {
              deleted_at: new Date().toISOString(),
            },
            {
              where: {
                invoice_id: req.params.id,
              },
            }
          );
        }
      }

      await sequelize.query(`
        UPDATE invoices
        SET invoice_date = '${req.body.invoice_date}',
            invoice_status = '${req.body.invoice_status}',
            remark = '${req.body.remark}'
        FROM quotation_sales
        WHERE invoices.invoice_id = '${req.params.id}'
          AND quotation_sales.sale_id = invoices.sale_id
          AND quotation_sales.bus_id = '${req.userData.bus_id}'
      `);

      return ResponseManager.SuccessResponse(req, res, 200, "Invoice Saved");
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async deleteInvoice(req, res) {
    try {
      const deleteqto = await Invoice.findOne({
        where: {
          sale_id: req.params.id,
        },
      });
      if (deleteqto) {
        await Invoice.destroy({
          where: {
            sale_id: req.params.id,
          },
        });
        await TaxInvoice.destroy({
          where: {
            sale_id: req.params.id,
          },
        });
        await Billing.destroy({
          where: {
            sale_id: req.params.id,
          },
        });

        await Quotation_sale.update(
          {
            status: "Pending",
            deleted_at: "",
          },
          {
            where: {
              sale_id: req.params.id,
            },
          }
        );
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Invoice Deleted"
        );
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No Invoice found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getBilling(req, res) {
    try {
      let result = [];

      const { bus_id } = req.userData;

      const log = await sequelize.query(
        quotationQueries.GET_BILLINGS,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { bus_id },
        }
      );

      // เรียกใช้ query สำหรับดึงรายละเอียดสินค้า
      const product_detail = await sequelize.query(
        quotationQueries.GET_ALL_QUOTATION_DETAILS,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      log.forEach((sale) => {
        const saleData = {
          billing_id: sale.billing_id,
          sale_id: sale.sale_id,
          tax_invoice_number: sale.tax_invoice_number,
          quotation_num: sale.sale_number,
          status: sale.status,
          employee_id: sale.employee_id,
          employee_name: `${sale.first_name} ${sale.last_name}`,
          customer_id: sale.customer_id,
          customer_name: sale.customer_name,
          customer_address: sale.customer_address,
          customer_tel: sale.customer_tel,
          customer_email: sale.customer_email,
          customer_tax: sale.customer_tax,
          cus_purchase: sale.cus_purchase,
          quotation_start_date: sale.sale_date,
          credit_date: sale.credit_date_number,
          quotation_expired_date: sale.credit_expired_date,
          sale_totalprice: sale.sale_totalprice,
          invoice_id: sale.invoice_id,
          invoice_number: sale.invoice_number,
          invoice_status: sale.invoice_status,
          invoice_date: sale.invoice_date,
          billing_date: sale.billing_date,
          billing_status: sale.billing_status,
          payments: sale.payments,
          remark: sale.billings_remark,
          vatType: sale.vatType,
          deleted_at: sale.billings_deleted_at,
          discount_quotation: sale.discount_quotation,
          billing:
            sale.invoice_status !== "Issue a receipt"
              ? "Pending"
              : sale.billing_number,
          details: [],
        };

        // Filter product details for the current sale
        const saleDetails = product_detail.filter(
          (detail) => detail.sale_id === sale.sale_id
        );
        saleDetails.forEach((detail) => {
          saleData.details.push({
            sale_id: detail.sale_id,
            product_id: detail.product_id,
            sale_price: detail.sale_price,
            discounttype: detail.discounttype,
            sale_discount: detail.sale_discount,
            sale_qty: detail.sale_qty,
            product_detail: detail.product_detail,
            pro_unti: detail.pro_unti,
          });
        });

        // Add the complete sale data to the result
        result.push(saleData);
        console.log(saleData);
      });

      return ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async editBilling(req, res) {
    try {
      const { bus_id } = req.userData;

      const existQuatationSale = await Billing.findOne({
        where: {
          billing_id: req.params.id,
        },
      });

      if (existQuatationSale) {
      }

      await sequelize.query(`
        UPDATE billings
        SET billing_date = '${req.body.billing_date}',
            payments = '${req.body.payments}',
            remark = '${req.body.remark}'
        FROM invoices
        LEFT JOIN quotation_sales ON quotation_sales.sale_id = invoices.sale_id
        WHERE billings.billing_id = '${req.params.id}'
          AND invoices.invoice_id = billings.invoice_id
          AND quotation_sales.bus_id = '${req.userData.bus_id}'
      `);

      return ResponseManager.SuccessResponse(req, res, 200, "Receipt Saved");
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async deleteBilling(req, res) {
    try {
      await Billing.destroy({
        where: {
          invoice_id: req.params.id,
        },
      });

      await TaxInvoice.update(
        { tax_invoice_status: "Pending", deleted_at: "" },
        {
          where: {
            invoice_id: req.params.id,
          },
        }
      );

      return ResponseManager.SuccessResponse(req, res, 200, "Billing Deleted ");
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async deleteQuotation(req, res) {
    try {
      const deleteqto = await Quotation_sale.findOne({
        where: {
          sale_id: req.params.id,
        },
      });
      if (deleteqto) {
        await Quotation_sale.destroy({
          where: {
            sale_id: req.params.id,
          },
        });

        await Quotation_sale.destroy({
          where: {
            sale_id: req.params.id,
          },
        });
        await Invoice.destroy({
          where: {
            sale_id: req.params.id,
          },
        });
        await TaxInvoice.destroy({
          where: {
            sale_id: req.params.id,
          },
        });
        await Billing.destroy({
          where: {
            sale_id: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Quotation Deleted"
        );
      } else {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Quotation found"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async exportFileQuotationData(req, res) {
    const { id } = req.params;

    try {
      const fileRecord = await Quotation_sale.findOne({
        where: { sale_id: id },
      });

      if (!fileRecord) {
        return res.status(404).json({ message: "File not found" });
      }

      const utf8Content = iconv.decode(fileRecord.file, "utf8");

      const tempDir = os.tmpdir();
      const filePath = path.join(tempDir, fileRecord.pdfname);
      fs.writeFileSync(filePath, utf8Content);

      res.download(filePath, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ message: "Error downloading file" });
        } else {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      return ResponseManager.CatchResponse(req, res, error.message);
    }
  }
  static async checkLastestQuotation(req, res) {
    try {
      const { bus_id } = req.userData;

      const lastestSale = await Quotation_sale.findOne({
        where: { bus_id: bus_id },
        order: [["sale_number", "DESC"]],
      });

      if (!lastestSale) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Quotation found"
        );
      }

      return ResponseManager.SuccessResponse(req, res, 200, lastestSale);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getBusinessByID(req, res) {
    try {
      const { bus_id, userId } = req.userData;

      const business = await User.findOne({
        include: [
          {
            model: Business,
            include: [
              {
                model: Bank,
              },
            ],
          },
        ],
        where: {
          bus_id: bus_id,
          userID: userId,
        },
      });

      return ResponseManager.SuccessResponse(req, res, 200, business);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getBank(req, res) {
    try {
      const business = await Bank.findAll();

      return ResponseManager.SuccessResponse(req, res, 200, business);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async editBusiness(req, res) {
    try {
      const editproduct = await Business.findOne({
        where: {
          bus_id: req.params.id,
        },
      });

      if (editproduct) {
        if (req.file && req.file.size > 5 * 1024 * 1024) {
          return ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "File size exceeds 5 MB limit"
          );
        } else {
          let productUpdateData = {
            business_name: req.body.business_name,
            business_address: req.body.business_address,
            business_website: req.body.business_website,
            business_tax: req.body.business_tax,
            business_tel: req.body.business_tel,
            bank_name: req.body.bank_name,
            bank_account: req.body.bank_account,
            bank_number: req.body.bank_number,
          };

          if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            productUpdateData.business_logo = result.secure_url;
          }

          await Business.update(productUpdateData, {
            where: {
              bus_id: req.params.id,
            },
          });
          await Bank.update(productUpdateData, {
            where: {
              bank_id: req.body.bank_id,
            },
          });
        }

        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          req.body.bank_name
        );
      } else {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Business found"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async deleteQuotataion_img(req, res) {
    try {
      await Quotation_img.destroy({
        where: {
          quotation_id: req.body.quotation_id,
        },
      });
      return ResponseManager.SuccessResponse(
        req,
        res,
        200,
        "delete image quotataion suucess"
      );
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err);
    }
  }

  static async AddQuotation_img(req, res) {
    try {
      const today = new Date();
      const DateString = today.toISOString().split("T")[0];
      const editproduct = await Quotation_img.findOne({
        where: {
          quotation_id: req.body.quotation_id,
        },
      });

      if (editproduct) {
        await Quotation_img.destroy({
          where: {
            quotation_id: req.body.quotation_id,
          },
        });
      }
      // return false;

      if (!req.file) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "Please choose a product image file"
        );
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "File size exceeds 5 MB limit"
        );
      }

      const allowedMimeTypes = ["image/jpeg", "image/png"];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "Only JPEG and PNG image files are allowed"
        );
      }

      const result = await cloudinary.uploader.upload(req.file.path);

      const insert_product = await Quotation_img.create({
        quotation_id: req.body.quotation_id,
        quotation_img: result.secure_url,
      });
      return ResponseManager.SuccessResponse(req, res, 200, insert_product);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, req.body);
    }
  }

  static async AddExpense_img(req, res) {
    try {
      const today = new Date();
      const DateString = today.toISOString().split("T")[0];

      if (!req.file) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "Please choose a product image file"
        );
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "File size exceeds 5 MB limit"
        );
      }
      const allowedMimeTypes = ["image/jpeg", "image/png"];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "Only JPEG and PNG image files are allowed"
        );
      }

      if (req.file) {
        let productUpdateData = {};
        const result = await cloudinary.uploader.upload(req.file.path);
        productUpdateData.expense_image = result.secure_url;

        await Expense.update(productUpdateData, {
          where: {
            expense_id: req.body.expense_id,
          },
        });
      }

      return ResponseManager.SuccessResponse(req, res, 200, insert_product);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, req.body);
    }
  }

  static async getQuotation_img(req, res) {
    try {
      const business = await Quotation_img.findAll();

      return ResponseManager.SuccessResponse(req, res, 200, business);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async Edit_getQuotation_img(req, res) {
    try {
      const editproduct = await Quotation_img.findOne({
        where: {
          quotation_id: req.params.id,
        },
      });

      if (editproduct) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "quptation img Updated"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getCompanyPerson(req, res) {
    try {
      const log = await sequelize.query(
        `
        SELECT * 
        FROM company_people
        LEFT JOIN customers ON customers.customer_id = company_people.company_person_customer
        LEFT JOIN businesses ON businesses.bus_id = company_people.bus_id
        `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const { bus_id } = req.userData;

      // Use 'let' if you intend to modify the array
      let customer = log;

      // If you want to filter by `bus_id`, you can add filtering logic here
      if (bus_id) {
        customer = customer.filter((person) => person.bus_id === bus_id);
      }

      return ResponseManager.SuccessResponse(req, res, 200, customer);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async addCompany(req, res) {
    try {

      const { bus_id } = req.userData;

      const addCustomer = await Company_person.findOne({
        where: {
          company_person_name: req.body.company_person_name,
          bus_id: bus_id,
        },
      });
      if (addCustomer) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Customer already exists"
        );
      }

      const insert_cate = await Company_person.create({
        company_person_name: req.body.company_person_name,
        company_person_address: req.body.company_person_address,
        company_person_tel: req.body.company_person_tel,
        company_person_email: req.body.company_person_email,
        company_person_customer: req.body.company_person_customer,
        company_person_status: "active",
        bus_id: bus_id,
        company_status: "active",
      });

      return ResponseManager.SuccessResponse(req, res, 200, insert_cate);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async GetSaleReportByProductType(req, res) {
    try {
      const { bus_id } = req.userData;
      const { startDate, endDate } = req.body; // รับ bus_id, startDate, และ endDate จาก req.body

      const log = await sequelize.query(
        reportQueries.GET_SALE_REPORT_BY_PRODUCT_TYPE, 
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { bus_id, startDate, endDate },
        }
      );

      // ส่งผลลัพธ์กลับไปยัง client
      return ResponseManager.SuccessResponse(req, res, 200, log);
    } catch (err) {
      // ส่งข้อผิดพลาดหากเกิดปัญหา
      console.error("Error in GetSaleReportByProductType:", err);
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async GetSaleReportByCategory(req, res) {
    try {
      const { bus_id } = req.userData;
      const { startDate, endDate } = req.body; // รับ bus_id, startDate, และ endDate จาก req.body

      const log = await sequelize.query(
        reportQueries.GET_SALE_REPORT_BY_CATEGORY, // << แก้ไขตรงนี้
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { bus_id, startDate, endDate },
        }
      );

      // ส่งผลลัพธ์กลับไปยัง client
      return ResponseManager.SuccessResponse(req, res, 200, log);
    } catch (err) {
      // ส่งข้อผิดพลาดหากเกิดปัญหา
      console.error("Error in GetSaleReportByProductType:", err);
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async GetSaleReportByProdcutRank(req, res) {
    try {
      const { bus_id } = req.userData;
      const { startDate, endDate } = req.body; // รับ bus_id, startDate, และ endDate จาก req.body

      const log = await sequelize.query(
        reportQueries.GET_SALE_REPORT_BY_PRODUCT_RANK, // << แก้ไขตรงนี้
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { bus_id, startDate, endDate },
        }
      );

      // ส่งผลลัพธ์กลับไปยัง client
      return ResponseManager.SuccessResponse(req, res, 200, log);
    } catch (err) {
      // ส่งข้อผิดพลาดหากเกิดปัญหา
      console.error("Error in GetSaleReportByProductType:", err);
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async GetSaleReportByService(req, res) {
    try {
      const { bus_id } = req.userData;
      const { startDate, endDate } = req.body; // รับ bus_id, startDate, และ endDate จาก req.body

      const log = await sequelize.query(
        reportQueries.GET_SALE_REPORT_BY_SERVICE, // << แก้ไขตรงนี้
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { bus_id, startDate, endDate },
        }
      );

      // ส่งผลลัพธ์กลับไปยัง client
      return ResponseManager.SuccessResponse(req, res, 200, log);
    } catch (err) {
      // ส่งข้อผิดพลาดหากเกิดปัญหา
      console.error("Error in GetSaleReportByProductType:", err);
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
}

module.exports = QuotationSaleController;
