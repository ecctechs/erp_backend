const ResponseManager = require("../middleware/ResponseManager");
const {Business,Bank,Customer,Quotation_sale,Quotation_sale_detail,Invoice,Billing} = require('../model/quotationModel'); // call model
const {Employee,Position,Salary_pay,Department,} = require("../model/employeeModel"); // call model
const { cloudinary } = require("../utils/cloudinary");
const { Op } = require('sequelize'); // Import Op from sequelize

class QuotationSaleController {

    static async getBusiness(req, res) {
        try {

            Business.hasMany(Bank, { foreignKey: 'bank_id' });

            const business = await Business.findAll({
                include: [
                  {
                    model: Bank,
                  },
                ]
            })
      
            return ResponseManager.SuccessResponse(req, res, 200, business);
          } catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message);
          }
    }

    static async getCustomer(req, res) {
        try {

            const customer = await Customer.findAll();
            
            return ResponseManager.SuccessResponse(req, res, 200, customer);
          } catch (err) {
            return ResponseManager.CatchResponse(req, res, err.message);
          }
    }
    static async addCustomer(req, res) {
      try {   
        const addCustomer = await Customer.findOne({
            where: {
                cus_name: req.body.cus_name,
              },
        })         
            if(addCustomer){
                return ResponseManager.SuccessResponse(req,res,400,"Customer already exists") 
            }else{
                const insert_cate = await Customer.create({
                  cus_name:req.body.cus_name,  
                  cus_address:req.body.cus_address,  
                  cus_tel:req.body.cus_tel, 
                  cus_email:req.body.cus_email, 
                  cus_tax:req.body.cus_tax, 
                  cus_purchase:req.body.cus_purchase, 
                })
                console.log(req.body)
                return ResponseManager.SuccessResponse(req,res,200,(insert_cate))   
            }   
         
    }catch (err) {
        return ResponseManager.CatchResponse(req, res, err.message)
    }
  }

  static async editCustomer(req, res) {
    try {   
      const editemp = await Customer.findOne({
          where: {
            cus_id: req.params.id,
            },
      })       
      if(editemp){
          const existingUser = await Customer.findOne({
              where: {
                cus_name: req.body.cus_name,
                  cus_id: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
              },
          });
  
          if (existingUser) {
              await ResponseManager.ErrorResponse(req, res, 400, "Customer already exists");
              return;
          }
          await Customer.update(
          {
              cus_name: req.body.cus_name,
              cus_address:req.body.cus_address,  
              cus_tel:req.body.cus_tel, 
              cus_email:req.body.cus_email, 
              cus_tax:req.body.cus_tax, 
              cus_purchase:req.body.cus_purchase, 
          },
          {
              where: {
                  cus_id: req.params.id,
              },
          }               
      )
      return ResponseManager.SuccessResponse(req,res,200,"Customer Updated") 
  }             
  }catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message)
  }
}
static async deleteCustomer(req, res) {
  //delete product
  try {
    const deleteproduct = await Customer.findOne({
      where: {
        cus_id: req.params.id,
      },
    });
    if (deleteproduct) {
      await Customer.destroy({
        where: {
          cus_id: req.params.id,
        },
      });
      return ResponseManager.SuccessResponse(req, res, 200, "Customer Deleted");
    } else {
      return ResponseManager.ErrorResponse(req, res, 400, "No Customer found");
    }
  } catch (err) {
    return ResponseManager.CatchResponse(req, res, err.message);
  }
}

    static async addBusiness(req, res) {
        try {
    
          const checkBusiness = await Business.findOne({
            where: {
                bus_id: 1,
                // bus_name: req.body.bus_name,
            },
          });
          if (!checkBusiness) {

            const allowedMimeTypes = ['image/jpeg', 'image/png'];

            if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
                return ResponseManager.ErrorResponse(req, res, 400, "Only JPEG and PNG image files are allowed");
            }

            if (req.file && req.file.size > 5 * 1024 * 1024) {
              res.status(400).json({ error: "File size exceeds 5 MB limit" });
            } 
              const result = await cloudinary.uploader.upload(req.file.path);
              
              const createbank = await Bank.create({
                bank_name:req.body.bank_name,
                bank_account:req.body.bank_account,
                bank_number: req.body.bank_number,
              });
              if(createbank) {
                await Business.create({
                  // productID: req.body.productID,
                  bus_name: req.body.bus_name,
                  bus_address: req.body.bus_address,
                  bus_website: req.body.bus_website,
                  bus_tel: req.body.bus_tel,
                  bus_tax: req.body.bus_tax,
                  bus_logo: result.secure_url,
                  bank_id: createbank.bank_id
                });
              }    
              return ResponseManager.SuccessResponse(req, res, 200, 'Success');
            

          } else {

            console.log("starttttttttttttttttttt")
            let productUpdateData = {
              bus_name: req.body.bus_name,
              bus_address: req.body.bus_address,
              bus_website: req.body.bus_website,
              bus_tax: req.body.bus_tax,
              bus_tel: req.body.bus_tel,
              bank_name: req.body.bank_name,
              bank_account: req.body.bank_account,
              bank_number: req.body.bank_number,
            };


            if (req.file) {
              const allowedMimeTypes = ['image/jpeg', 'image/png'];

              if (!allowedMimeTypes.includes(req.file.mimetype)) {
                  return ResponseManager.ErrorResponse(req, res, 400, "Only JPEG and PNG image files are allowed");
              }

              if (req.file.size > 5 * 1024 * 1024) {
                return ResponseManager.ErrorResponse(req, res, 400, "File size exceeds 5 MB limit");
                  // return res.status(400).json({ error: "File size exceeds 5 MB limit" });
              }

              const result = await cloudinary.uploader.upload(req.file.path);


              console.log("processssssss",result)

              console.log("==========test Before:",result.secure_url)
              productUpdateData.bus_logo = result.secure_url;

              console.log("==========test After:",productUpdateData.bus_logo)
          }

            await Business.update(
                productUpdateData,
                {
                    where: {
                      bus_id: 1,
                    },
                }
            );
            await Bank.update(
              productUpdateData,
              {
                  where: {
                    bank_id: 1,
                  },
              }
            );
            return ResponseManager.SuccessResponse(req, res, 200, 'Success');
          }
        } catch (err) {
          return ResponseManager.CatchResponse(req, res, err.message);
        }

    }
    static async addQuotationSaleOld(req, res) {
      try {
          const addCustomer = await Customer.findOne({
              where: {
                  cus_email: req.body.cus_email,
              },
            });
            if (addCustomer) {

              const sale_chk = await Quotation_sale.findOne({
                  where: {
                      sale_number: req.body.sale_number,
                  },
                });

              if(sale_chk){
                return ResponseManager.ErrorResponse( req,res,400,"Quotation already exists");
              }else{

              const insert_Quo = await Quotation_sale.create({
                          sale_number:req.body.sale_number,
                          sale_date:req.body.sale_date,
                          credit_date_number:req.body.credit_date_number,
                          credit_expired_date: req.body.credit_expired_date,
                          sale_totalprice: req.body.sale_totalprice,
                          bus_id: req.body.bus_id,
                          cus_id: req.body.cus_id,
                          employeeID: req.body.employeeID,
                        });

                        const products = req.body.products;
                        for (let i = 0; i < products.length; i++) {
                          products[i].sale_id = insert_Quo.sale_id
                        }
                        console.log(insert_Quo.sale_id)

                        // ใช้ Sequelize's bulkCreate เพื่อบันทึกข้อมูลทั้งหมดในกรณีที่มีข้อผิดพลาด
                      await Quotation_sale_detail.bulkCreate(products);

                      return ResponseManager.SuccessResponse(req, res, 200, 'Success');
              }
                        
            } else {

              const sale_chk = await Quotation_sale.findOne({
                  where: {
                    sale_number: req.body.sale_number,
                },
                });

              if(sale_chk){
                return ResponseManager.ErrorResponse( req,res,400,"Quotation already exists");
              }else{

              const insert_Customer = await Customer.create({
                  cus_name:req.body.cus_name,
                  cus_address:req.body.cus_address,
                  cus_tel:req.body.cus_tel,
                  cus_email: req.body.cus_email,
                  cus_tax: req.body.cus_tax,
                  cus_purchase: req.body.cus_purchase,
                });

                if(insert_Customer){
                  const insert_Quo = await Quotation_sale.create({
                      sale_number:req.body.sale_number,
                      sale_date:req.body.sale_date,
                      credit_date_number:req.body.credit_date_number,
                      credit_expired_date: req.body.credit_expired_date,
                      sale_totalprice: req.body.sale_totalprice,
                      bus_id: req.body.bus_id,
                      cus_id: req.body.cus_id,
                      employeeID: req.body.employeeID,
                      status: req.body.status,
                    });

                    const products = req.body.products;
                    for (let i = 0; i < products.length; i++) {
                      products[i].sale_id = insert_Quo.sale_id
                    }
                    console.log(insert_Quo.sale_id)


                  // ใช้ Sequelize's bulkCreate เพื่อบันทึกข้อมูลทั้งหมดในกรณีที่มีข้อผิดพลาด
                  await Quotation_sale_detail.bulkCreate(products);

                  return ResponseManager.SuccessResponse(req, res, 200, 'Success');
                  }
              }
            }
        } catch (err) {
          return ResponseManager.CatchResponse(req, res, err.message);
        }
  }
    static async addQuotationSale(req, res) {
      console.log("Received sale_number:     ", req.body.sale_number);
      console.log("Received data:    ", req.body); // ตรวจสอบข้อมูลทั้งหมดที่ได้รับ
        try {
          const existQuatationSale = await Quotation_sale.findOne({
            where: {
                sale_number: req.body.sale_number,
            },
          });

          if (existQuatationSale) {
            return ResponseManager.ErrorResponse(req, res, 400, "Quotation already exists");
          } 


          const existCustomer = await Customer.findOne({
            where: {
              cus_id: req.body.cus_id,
            },
          });

          if (!existCustomer) {
            return ResponseManager.ErrorResponse(req, res, 400, "No Customer found");
          } 

          const insert_Quo = await Quotation_sale.create({
            sale_number:req.body.sale_number,
            sale_date:req.body.sale_date,
            credit_date_number:req.body.credit_date_number,
            credit_expired_date: req.body.credit_expired_date,
            sale_totalprice: req.body.sale_totalprice,
            bus_id: req.body.bus_id,
            cus_id: req.body.cus_id,
            employeeID: req.body.employeeID,
            status: req.body.status,
            remark: req.body.remark,
          });

          const products = req.body.products;
          for (let i = 0; i < products.length; i++) {
            products[i].sale_id = insert_Quo.sale_id
          }
          console.log(insert_Quo.sale_id)
          await Quotation_sale_detail.bulkCreate(products);

          return ResponseManager.SuccessResponse(req, res, 200, insert_Quo);


        } catch (err) {
          return ResponseManager.CatchResponse(req, res, err.message);
        }
    }
    static async editQuotationSale(req, res) {
      try {
          const existQuatationSale = await Quotation_sale.findOne({
              where: {
                  sale_id: req.params.id,
              },
          });
  
          if (existQuatationSale) {
              const existingQuo = await Quotation_sale.findOne({
                  where: {
                      sale_number: req.body.sale_number,
                      sale_id: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
                  },
              });
  
              if (existingQuo) {
                  await ResponseManager.ErrorResponse(req, res, 400, "Quotation already exists");
                  return;
              }
          }
  

          if(req.body.status = "allowed"){
            const today = new Date();
            const invoiceDateStr = today.toISOString().split('T')[0];

            const lastInvoice = await Invoice.findOne({
                order: [['invoice_number', 'DESC']]
            });
        
            let newInvoiceNumber;
        
            if (!lastInvoice) {
                // ถ้าไม่มี invoice ในระบบ ให้เริ่มที่ IN-00000001
                newInvoiceNumber = 'IN-00000001';
            } else {
                // ถ้ามี invoice แล้ว ให้เพิ่ม 1 จาก invoice_number ล่าสุด
                const lastNumber = parseInt(lastInvoice.invoice_number.slice(3)); // ตัด 'IN-' ออกแล้วแปลงเป็นเลข
                const nextNumber = lastNumber + 1;
                newInvoiceNumber = 'IN-' + nextNumber.toString().padStart(8, '0'); // เติม 0 ข้างหน้าให้เลขมีความยาว 8 หลัก
            }

            await Invoice.create({
              invoice_number:newInvoiceNumber,
              invoice_date: invoiceDateStr,
              invoice_status: 'pending',
              remark: '',
              sale_id: req.params.id
            });
          }

          await Quotation_sale.update({
              sale_date: req.body.sale_date,
              credit_date_number: req.body.credit_date_number,
              credit_expired_date: req.body.credit_expired_date,
              sale_totalprice: req.body.sale_totalprice,
              bus_id: req.body.bus_id,
              cus_id: req.body.cus_id,
              employeeID: req.body.employeeID,
              status: req.body.status,
              remark: req.body.remark,
          }, {
              where: {
                  sale_id: req.params.id,
              }
          });
  
          const products = req.body.products;
          
          // ลบรายการสินค้าเก่าออกก่อน
          await Quotation_sale_detail.destroy({
              where: {
                  sale_id: req.params.id,
              }
          });
  
          // เพิ่มสินค้าแต่ละรายการในลูป
          for (let i = 0; i < products.length; i++) {
              products[i].sale_id = req.params.id; // ใช้ sale_id ที่ส่งเข้ามา
              await Quotation_sale_detail.create(products[i]);
          }
  
          return ResponseManager.SuccessResponse(req, res, 200, 'Quotation Saved');
  
      } catch (err) {
          return ResponseManager.CatchResponse(req, res, err.message);
      }
  }
    static async getQuotation(req,res){
      try {

      Quotation_sale.hasMany(Quotation_sale_detail, { foreignKey: "sale_id" });
      Quotation_sale_detail.belongsTo(Quotation_sale, { foreignKey: "sale_id" });

      Quotation_sale.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Quotation_sale, { foreignKey: "bus_id" });

      Business.hasMany(Bank, { foreignKey: "bank_id" });
      Bank.belongsTo(Business, { foreignKey: "bank_id" });

      Quotation_sale.belongsTo(Employee, { foreignKey: "employeeID" });
      Employee.hasMany(Quotation_sale, { foreignKey: "employeeID" });

      Quotation_sale.belongsTo(Customer, { foreignKey: "cus_id" });
      Customer.hasMany(Quotation_sale, { foreignKey: "cus_id" });

      Quotation_sale.hasOne(Invoice, { foreignKey: "sale_id" });
      Invoice.belongsTo(Quotation_sale, { foreignKey: "sale_id" });

      let result = [];  
      let quotationslist = [];

      quotationslist = await Quotation_sale.findAll({
          include: [
          { model: Quotation_sale_detail}, 
          { model: Employee}, 
          { model: Customer}, 
          { model: Business , include: [Bank]}, 
          { model: Invoice }
          ],
        });
        const today = new Date();

        for (let log of quotationslist) {
            const expiredDate = new Date(log.credit_expired_date);
            
            // ตรวจสอบว่า credit_expired_date น้อยกว่าวันที่ปัจจุบันหรือไม่
            if (today > expiredDate) {
                // หากใช่ อัปเดตสถานะเป็น 'expired'
                log.status = 'expired';

                // อัปเดตสถานะในฐานข้อมูล
                await Quotation_sale.update({ status: 'expired' }, { where: { sale_id: log.sale_id } });
            }

            result.push({
                sale_id: log.sale_id,
                quotation_num: log.sale_number,
                status: log.status,
                employeeID: log.employeeID,
                employee_name: log.employee.F_name + ' ' + log.employee.L_name,
                cus_id: log.cus_id,
                cus_name: log.customer.cus_name,
                cus_address: log.customer.cus_address,
                cus_tel: log.customer.cus_tel,
                cus_email: log.customer.cus_email,
                cus_tax: log.customer.cus_tax,
                cus_purchase: log.customer.cus_purchase,
                quotation_start_date: log.sale_date,
                credit_date: log.credit_date_number,
                quotation_expired_date: log.credit_expired_date,
                sale_totalprice: log.sale_totalprice,
                remark: log.remark,
                invoice: (!log.invoice || log.status !== 'allowed') ? 'pending' : log.invoice.invoice_number,
                details: log.quotation_sale_details.map(detail => ({
                    sale_id: detail.sale_id,
                    productID: detail.productID,
                    sale_price: detail.sale_price,
                    sale_discount: detail.sale_discount,
                    sale_qty: detail.sale_qty
                })),
            });
        }
        
        return ResponseManager.SuccessResponse(req, res, 200, result);
      } catch (err) {
        return ResponseManager.CatchResponse(req, res, err.message);
      }
    }

    static async getInvoice(req,res){
      try {

      Quotation_sale.hasMany(Quotation_sale_detail, { foreignKey: "sale_id" });
      Quotation_sale_detail.belongsTo(Quotation_sale, { foreignKey: "sale_id" });

      Quotation_sale.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Quotation_sale, { foreignKey: "bus_id" });

      Business.hasMany(Bank, { foreignKey: "bank_id" });
      Bank.belongsTo(Business, { foreignKey: "bank_id" });

      Quotation_sale.belongsTo(Employee, { foreignKey: "employeeID" });
      Employee.hasMany(Quotation_sale, { foreignKey: "employeeID" });

      Quotation_sale.belongsTo(Customer, { foreignKey: "cus_id" });
      Customer.hasMany(Quotation_sale, { foreignKey: "cus_id" });

      Quotation_sale.hasOne(Invoice, { foreignKey: "sale_id" });
      Invoice.belongsTo(Quotation_sale, { foreignKey: "sale_id" });

      Invoice.hasOne(Billing, { foreignKey: "invoice_id" });
      Billing.belongsTo(Invoice, { foreignKey: "invoice_id" });

      let result = [];  
      let quotationslist = [];

      quotationslist = await Quotation_sale.findAll({
          include: [
          { model: Quotation_sale_detail}, 
          { model: Employee}, 
          { model: Customer}, 
          { model: Business , include: [Bank]}, 
          { model: Invoice, include: [Billing] }
          ],
        });
        const today = new Date();

        for (let log of quotationslist) {
            const expiredDate = new Date(log.invoice.invoice_date);
            
            // ตรวจสอบว่า credit_expired_date น้อยกว่าวันที่ปัจจุบันหรือไม่
            if (today > expiredDate) {
                // หากใช่ อัปเดตสถานะเป็น 'expired'
                log.invoice.invoice_status = 'expired';

                // อัปเดตสถานะในฐานข้อมูล
                await Invoice.update({ invoice_status: 'expired' }, { where: { invoice_id: log.invoice.invoice_id } });
            }

            result.push({
                sale_id: log.sale_id,
                quotation_num: log.sale_number,
                status: log.status,
                employeeID: log.employeeID,
                employee_name: log.employee.F_name + ' ' + log.employee.L_name,
                cus_id: log.cus_id,
                cus_name: log.customer.cus_name,
                cus_address: log.customer.cus_address,
                cus_tel: log.customer.cus_tel,
                cus_email: log.customer.cus_email,
                cus_tax: log.customer.cus_tax,
                cus_purchase: log.customer.cus_purchase,
                quotation_start_date: log.sale_date,
                credit_date: log.credit_date_number,
                quotation_expired_date: log.credit_expired_date,
                sale_totalprice: log.sale_totalprice,
                invoice_id: log.invoice.invoice_id,
                invoice_number: log.invoice.invoice_number,
                invoice_status: log.invoice.invoice_status,
                invoice_date: log.invoice.invoice_date,
                invoice_remark: log.invoice.remark,
                billing: (!log.invoice.billing || log.invoice.invoice_status !== 'issue a receipt') ? 'pending' : log.invoice.billing.billing_number,
                details: log.quotation_sale_details.map(detail => ({
                    sale_id: detail.sale_id,
                    productID: detail.productID,
                    sale_price: detail.sale_price,
                    sale_discount: detail.sale_discount,
                    sale_qty: detail.sale_qty
                })),
            });
        }
        
        return ResponseManager.SuccessResponse(req, res, 200, result);
      } catch (err) {
        return ResponseManager.CatchResponse(req, res, err.message);
      }
    }
    static async editInvoice(req, res) {
      try {
          const existQuatationSale = await Invoice.findOne({
              where: {
                  invoice_id: req.params.id,
              },
          });
  
          if (existQuatationSale) {
              const existingQuo = await Invoice.findOne({
                  where: {
                      invoice_number: req.body.invoice_number,
                      invoice_id: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
                  },
              });
  
              if (existingQuo) {
                  await ResponseManager.ErrorResponse(req, res, 400, "Invoice already exists");
                  return;
              }
          }
  

          if(req.body.invoice_status = "issue a receipt"){
            const today = new Date();
            const invoiceDateStr = today.toISOString().split('T')[0];

            const lastInvoice = await Billing.findOne({
                order: [['billing_number', 'DESC']]
            });
        
            let newInvoiceNumber;
        
            if (!lastInvoice) {
                // ถ้าไม่มี invoice ในระบบ ให้เริ่มที่ IN-00000001
                newInvoiceNumber = 'BI-00000001';
            } else {
                // ถ้ามี invoice แล้ว ให้เพิ่ม 1 จาก invoice_number ล่าสุด
                const lastNumber = parseInt(lastInvoice.billing_number.slice(3)); // ตัด 'IN-' ออกแล้วแปลงเป็นเลข
                const nextNumber = lastNumber + 1;
                newInvoiceNumber = 'BI-' + nextNumber.toString().padStart(8, '0'); // เติม 0 ข้างหน้าให้เลขมีความยาว 8 หลัก
            }

            await Billing.create({
              billing_number:newInvoiceNumber,
              billing_date:invoiceDateStr,
              billing_status: 'Complete',
              payments: 'cash',
              remark: '',
              invoice_id: req.params.id
            });
          }

          await Invoice.update({
              invoice_date: req.body.invoice_date,
              invoice_status: req.body.invoice_status,
              remark: req.body.remark,
          }, {
              where: {
                  invoice_id: req.params.id,
              }
          });        
  
          return ResponseManager.SuccessResponse(req, res, 200, 'Invoice Saved');
  
      } catch (err) {
          return ResponseManager.CatchResponse(req, res, err.message);
      }
  }
  static async deleteInvoice(req,res){
 
    try {
      const deleteqto = await Invoice.findOne({
        where: {
          invoice_id: req.params.id,
        },
      });
      if (deleteqto) {
        await Invoice.destroy({
          where: {
            invoice_id: req.params.id,
          },
        });
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
static async getBilling(req,res){
  try {

  Quotation_sale.hasMany(Quotation_sale_detail, { foreignKey: "sale_id" });
  Quotation_sale_detail.belongsTo(Quotation_sale, { foreignKey: "sale_id" });

  Quotation_sale.belongsTo(Business, { foreignKey: "bus_id" });
  Business.hasMany(Quotation_sale, { foreignKey: "bus_id" });

  Business.hasMany(Bank, { foreignKey: "bank_id" });
  Bank.belongsTo(Business, { foreignKey: "bank_id" });

  Quotation_sale.belongsTo(Employee, { foreignKey: "employeeID" });
  Employee.hasMany(Quotation_sale, { foreignKey: "employeeID" });

  Quotation_sale.belongsTo(Customer, { foreignKey: "cus_id" });
  Customer.hasMany(Quotation_sale, { foreignKey: "cus_id" });

  Quotation_sale.hasOne(Invoice, { foreignKey: "sale_id" });
  Invoice.belongsTo(Quotation_sale, { foreignKey: "sale_id" });

  Invoice.hasOne(Billing, { foreignKey: "invoice_id" });
  Billing.belongsTo(Invoice, { foreignKey: "invoice_id" });

  let result = [];  
  let quotationslist = [];

  quotationslist = await Quotation_sale.findAll({
      include: [
      { model: Quotation_sale_detail}, 
      { model: Employee}, 
      { model: Customer}, 
      { model: Business , include: [Bank]}, 
      { model: Invoice, include: [Billing] }
      ],
    });
    const today = new Date();

    for (let log of quotationslist) {

        result.push({
            sale_id: log.sale_id,
            quotation_num: log.sale_number,
            status: log.status,
            employeeID: log.employeeID,
            employee_name: log.employee.F_name + ' ' + log.employee.L_name,
            cus_id: log.cus_id,
            cus_name: log.customer.cus_name,
            cus_address: log.customer.cus_address,
            cus_tel: log.customer.cus_tel,
            cus_email: log.customer.cus_email,
            cus_tax: log.customer.cus_tax,
            cus_purchase: log.customer.cus_purchase,
            quotation_start_date: log.sale_date,
            credit_date: log.credit_date_number,
            quotation_expired_date: log.credit_expired_date,
            sale_totalprice: log.sale_totalprice,
            invoice_id: log.invoice.invoice_id,
            invoice_number: log.invoice.invoice_number,
            invoice_status: log.invoice.invoice_status,
            invoice_date: log.invoice.invoice_date,
            billing_id: log.invoice.billing.billing_id,
            billing_number: log.invoice.billing.billing_number,
            billing_date: log.invoice.billing.billing_date,
            billing_status: log.invoice.billing.billing_status,
            payments: log.invoice.billing.payments,
            remark: log.invoice.billing.remark,
            details: log.quotation_sale_details.map(detail => ({
                sale_id: detail.sale_id,
                productID: detail.productID,
                sale_price: detail.sale_price,
                sale_discount: detail.sale_discount,
                sale_qty: detail.sale_qty
            })),
        });
    }
    
    return ResponseManager.SuccessResponse(req, res, 200, result);
  } catch (err) {
    return ResponseManager.CatchResponse(req, res, err.message);
  }
}
static async editBilling(req, res) {
  try {
      const existQuatationSale = await Billing.findOne({
          where: {
              billing_id: req.params.id,
          },
      });

      if (existQuatationSale) {
          const existingQuo = await Billing.findOne({
              where: {
                  billing_number: req.body.billing_number,
                  billing_id: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
              },
          });

          if (existingQuo) {
              await ResponseManager.ErrorResponse(req, res, 400, "Receipt already exists");
              return;
          }
      }


      await Billing.update({
          billing_date: req.body.billing_date,
          payments: req.body.payments,
          remark: req.body.remark,
      }, {
          where: {
              billing_id: req.params.id,
          }
      });        

      return ResponseManager.SuccessResponse(req, res, 200, 'Receipt Saved');

  } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
  }
}
static async deleteBilling(req,res){
 
  try {
    const deleteqto = await Billing.findOne({
      where: {
        billing_id: req.params.id,
      },
    });
    if (deleteqto) {
      await Invoice.destroy({
        where: {
          billing_id: req.params.id,
        },
      });
      return ResponseManager.SuccessResponse(
        req,
        res,
        200,
        "Receipt Deleted"
      );
    } else {
      return ResponseManager.ErrorResponse(req, res, 400, "No Receipt found");
    }
  
} catch (err) {
  return ResponseManager.CatchResponse(req, res, err.message);
}
}
    static async deleteQuotation(req,res){
 
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
          await Quotation_sale_detail.destroy({
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
          return ResponseManager.ErrorResponse(req, res, 400, "No Quotation found");
        }
      
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async exportFileQuotationData(req, res) {
      const { id } = req.params;

      try {
        const fileRecord = await Quotation_sale.findOne({ where: { sale_id: id } });

        if (!fileRecord) {
          return res.status(404).json({ message: 'File not found' });
        }

        // Decode content from database
        const utf8Content = iconv.decode(fileRecord.file, 'utf8');

        // สร้างไฟล์ชั่วคราวในไดเรกทอรีชั่วคราว
        const tempDir = os.tmpdir();
        const filePath = path.join(tempDir, fileRecord.pdfname);
        fs.writeFileSync(filePath, utf8Content);

        // ส่งไฟล์ให้ดาวน์โหลด
        res.download(filePath, (err) => {
          if (err) {
            console.error('Error downloading file:', err);
            res.status(500).json({ message: 'Error downloading file' });
          } else {
            fs.unlinkSync(filePath);  // ลบไฟล์ชั่วคราวหลังจากดาวน์โหลดเสร็จสิ้น
          }
        });
      } catch (error) {
          console.error('Error exporting data:', error);
          return ResponseManager.CatchResponse(req, res, error.message);
         
      }
  }
  static async checkLastestQuotation(req,res) {
    try {
      const lastestSale = await Quotation_sale.findOne({
        order: [['sale_number', 'DESC']]
      })

      if (!lastestSale) {
        return ResponseManager.ErrorResponse(req, res, 400, "No Quotation found");
      }

      return ResponseManager.SuccessResponse(req, res, 200, lastestSale);
    
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getBusinessByID(req,res){
  try{

    Business.hasMany(Bank, { foreignKey: 'bank_id' });

    const business = await Business.findOne({
        include: [
          {
            model: Bank,
          },
        ],
        where: {
          bus_id: req.params.id,
        },
    })

    return ResponseManager.SuccessResponse(req, res, 200, business);
  } catch (err) {
    return ResponseManager.CatchResponse(req, res, err.message);
  }

  }

  static async editBusiness(req,res){

    try {
      const editproduct = await Business.findOne({
          where: {
            bus_id: req.params.id,
          },
      });

      if (editproduct) {
          if (req.file && req.file.size > 5 * 1024 * 1024) {
              res.status(400).json({ error: "File size exceeds 5 MB limit" });
          } else {
              let productUpdateData = {
                bus_name: req.body.bus_name,
                bus_address: req.body.bus_address,
                bus_website: req.body.bus_website,
                bus_tax: req.body.bus_tax,
                bus_tel: req.body.bus_tel,
                bank_name: req.body.bank_name,
                bank_account: req.body.bank_account,
                bank_number: req.body.bank_number,
              };

              if (req.file) {
                  const result = await cloudinary.uploader.upload(req.file.path);
                  productUpdateData.bus_logo = result.secure_url; // Save Cloudinary image path
              }

              await Business.update(
                  productUpdateData,
                  {
                      where: {
                        bus_id: req.params.id,
                      },
                  }
              );
              await Bank.update(
                productUpdateData,
                {
                    where: {
                      bank_id: req.params.id,
                    },
                }
            );
          }

          return ResponseManager.SuccessResponse(req, res, 200, "Business Updated");
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No Business found");
      }
  } catch (err) {
    return ResponseManager.CatchResponse(req, res, err.message);
  }
    
  }


}

module.exports = QuotationSaleController;