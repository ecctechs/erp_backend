const express = require('express');
const Route = express.Router();
const RouteName = '/Quotation'
const { verifyTokenWithRole } = require('../middleware/verifytokenwithrole'); 

const QuotationSaleController = require('../controllers/QuotationSaleController');

const multer = require('multer');
var upload = multer({ dest: 'import/'});

Route.get(RouteName+'/getBusiness',QuotationSaleController.getBusiness)
Route.get(RouteName+'/getCustomer',QuotationSaleController.getCustomer)
Route.post(RouteName+'/addCustomer',QuotationSaleController.addCustomer)
Route.put(RouteName+'/editCustomer/:id',QuotationSaleController.editCustomer)
Route.delete(RouteName+'/deleteCustomer/:id',QuotationSaleController.deleteCustomer)
Route.post(RouteName+'/addBusiness', upload.single('file'), QuotationSaleController.addBusiness)
Route.post(RouteName+'/addQuotationSale', upload.single('file'), QuotationSaleController.addQuotationSale)
Route.put(RouteName+'/editQuotationSale/:id', QuotationSaleController.editQuotationSale)
Route.get(RouteName+'/getQuotation',QuotationSaleController.getQuotation)
Route.delete(RouteName+'/deleteQuotation/:id',QuotationSaleController.deleteQuotation)
Route.put(RouteName+'/editInvoice/:id', QuotationSaleController.editInvoice)
Route.get(RouteName+'/getInvoice',QuotationSaleController.getInvoice)
Route.delete(RouteName+'/deleteInvoice/:id',QuotationSaleController.deleteInvoice)
Route.put(RouteName+'/editBilling/:id', QuotationSaleController.editBilling)
Route.get(RouteName+'/getBilling',QuotationSaleController.getBilling)
Route.delete(RouteName+'/deleteBilling/:id',QuotationSaleController.deleteBilling)
Route.get(RouteName+'/getBusinessByID',QuotationSaleController.getBusinessByID)
Route.put(RouteName+'/editBusiness/:id', upload.single('file') ,QuotationSaleController.editBusiness)
Route.get(RouteName+'/checkLastestQuotation',QuotationSaleController.checkLastestQuotation)
Route.get(RouteName+'/exportFileQuotationData/:id', QuotationSaleController.exportFileQuotationData);

module.exports = Route