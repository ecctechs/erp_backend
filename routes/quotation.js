const express = require("express");
const Route = express.Router();
const RouteName = "/Quotation";
const {
  verifyTokenWithRole,
  verifyTokenWithbus_id,
} = require("../middleware/verifytokenwithrole");

const QuotationSaleController = require("../controllers/QuotationSaleController");

const multer = require("multer");
var upload = multer({ dest: "import/" });

Route.get(RouteName + "/getBusiness", QuotationSaleController.getBusiness);
Route.get(
  RouteName + "/getCustomer",
  verifyTokenWithbus_id,
  QuotationSaleController.getCustomer
);
Route.post(
  RouteName + "/addCustomer",
  verifyTokenWithbus_id,
  QuotationSaleController.addCustomer
);
Route.put(
  RouteName + "/editCustomer/:id",
  QuotationSaleController.editCustomer
);
Route.delete(
  RouteName + "/deleteCustomer/:id",
  QuotationSaleController.deleteCustomer
);
Route.post(
  RouteName + "/addBusiness",
  upload.single("file"),
  QuotationSaleController.addBusiness
);
Route.post(
  RouteName + "/addQuotationSale",
  upload.single("file"),
  verifyTokenWithbus_id,
  QuotationSaleController.addQuotationSale
);
Route.put(
  RouteName + "/editQuotationSale/:id",
  QuotationSaleController.editQuotationSale
);
Route.get(
  RouteName + "/getQuotation",
  verifyTokenWithbus_id,
  QuotationSaleController.getQuotation
);
Route.delete(
  RouteName + "/deleteQuotation/:id",
  QuotationSaleController.deleteQuotation
);
Route.put(RouteName + "/editInvoice/:id", QuotationSaleController.editInvoice);
Route.get(
  RouteName + "/getInvoice",
  verifyTokenWithbus_id,
  QuotationSaleController.getInvoice
);
Route.delete(
  RouteName + "/deleteInvoice/:id",
  QuotationSaleController.deleteInvoice
);
Route.put(RouteName + "/editBilling/:id", QuotationSaleController.editBilling);
Route.get(
  RouteName + "/getBilling",
  verifyTokenWithbus_id,
  QuotationSaleController.getBilling
);
Route.delete(
  RouteName + "/deleteBilling/:id",
  QuotationSaleController.deleteBilling
);
Route.get(
  RouteName + "/getBusinessByID",
  verifyTokenWithbus_id,
  QuotationSaleController.getBusinessByID
);

Route.get(
  RouteName + "/getBank",
  verifyTokenWithbus_id,
  QuotationSaleController.getBank
);
Route.put(
  RouteName + "/editBusiness/:id",
  upload.single("file"),
  QuotationSaleController.editBusiness
);
Route.get(
  RouteName + "/checkLastestQuotation",
  verifyTokenWithbus_id,
  QuotationSaleController.checkLastestQuotation
);
Route.get(
  RouteName + "/exportFileQuotationData/:id",
  QuotationSaleController.exportFileQuotationData
);

module.exports = Route;
