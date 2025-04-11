const express = require("express");
const Route = express.Router();
const RouteName = "/Quotation";
const {
  verifyTokenWithRole,
  verifyTokenWithbusiness_id,
} = require("../middleware/verifytokenwithrole");

const QuotationSaleController = require("../controllers/QuotationSaleController");

const multer = require("multer");
var upload = multer({ dest: "import/" });
var type = upload.single("file");

Route.get(RouteName + "/getBusiness", QuotationSaleController.getBusiness);
Route.get(
  RouteName + "/getCustomer",
  verifyTokenWithbusiness_id,
  QuotationSaleController.getCustomer
);
Route.post(
  RouteName + "/addCustomer",
  verifyTokenWithbusiness_id,
  QuotationSaleController.addCustomer
);
Route.put(
  RouteName + "/editCustomer/:id",
  QuotationSaleController.editCustomer
);
Route.put(
  RouteName + "/editCustomer2/:id",
  QuotationSaleController.editCustomer2
);
Route.delete(
  RouteName + "/deleteCustomer/:id",
  QuotationSaleController.deleteCustomer
);
Route.delete(
  RouteName + "/deleteCustomer2/:id",
  QuotationSaleController.deleteCustomer2
);
Route.post(
  RouteName + "/addBusiness",
  upload.single("file"),
  QuotationSaleController.addBusiness
);
Route.post(
  RouteName + "/addQuotationSale",
  upload.single("file"),
  verifyTokenWithbusiness_id,
  QuotationSaleController.addQuotationSale
);
Route.put(
  RouteName + "/editQuotationSale/:id",
  QuotationSaleController.editQuotationSale
);
Route.get(
  RouteName + "/getQuotation",
  verifyTokenWithbusiness_id,
  QuotationSaleController.getQuotation
);
Route.delete(
  RouteName + "/deleteQuotation/:id",
  QuotationSaleController.deleteQuotation
);
Route.put(RouteName + "/editInvoice/:id", QuotationSaleController.editInvoice);
Route.get(
  RouteName + "/getInvoice",
  verifyTokenWithbusiness_id,
  QuotationSaleController.getInvoice
);
Route.delete(
  RouteName + "/deleteInvoice/:id",
  QuotationSaleController.deleteInvoice
);
Route.put(RouteName + "/editBilling/:id", QuotationSaleController.editBilling);
Route.get(
  RouteName + "/getBilling",
  verifyTokenWithbusiness_id,
  QuotationSaleController.getBilling
);
Route.delete(
  RouteName + "/deleteBilling/:id",
  QuotationSaleController.deleteBilling
);
Route.get(
  RouteName + "/getBusinessByID",
  verifyTokenWithbusiness_id,
  QuotationSaleController.getBusinessByID
);

Route.get(
  RouteName + "/getBank",
  verifyTokenWithbusiness_id,
  QuotationSaleController.getBank
);
Route.put(
  RouteName + "/editBusiness/:id",
  upload.single("file"),
  QuotationSaleController.editBusiness
);
Route.get(
  RouteName + "/checkLastestQuotation",
  verifyTokenWithbusiness_id,
  QuotationSaleController.checkLastestQuotation
);
Route.get(
  RouteName + "/exportFileQuotationData/:id",
  QuotationSaleController.exportFileQuotationData
);
Route.post(
  RouteName + "/AddQuotation_img",
  // verifyTokenWithbusiness_id,
  type,
  QuotationSaleController.AddQuotation_img
);
Route.delete(
  RouteName + "/deleteQuotataion_img",
  QuotationSaleController.deleteQuotataion_img
);
Route.get(
  RouteName + "/getQuotation_img",
  QuotationSaleController.getQuotation_img
);
Route.put(
  RouteName + "/Edit_getQuotation_img/:id",
  type,
  QuotationSaleController.Edit_getQuotation_img
);

Route.get(
  RouteName + "/getCompanyPerson",
  verifyTokenWithbusiness_id,
  QuotationSaleController.getCompanyPerson
);
Route.post(
  RouteName + "/addCustomer2",
  verifyTokenWithbusiness_id,
  QuotationSaleController.addCustomer2
);
module.exports = Route;
