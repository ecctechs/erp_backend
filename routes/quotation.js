const express = require('express');
const Route = express.Router();
const RouteName = '/Quotation'
const { verifyTokenWithRole } = require('../middleware/verifytokenwithrole'); 

const QuotationSaleController = require('../controllers/QuotationSaleController');

const multer = require('multer');
var upload = multer({ dest: 'upload/'});
var type = upload.single('bus_logo');

Route.get(RouteName+'/getBusiness',QuotationSaleController.getBusiness)
Route.get(RouteName+'/getCustomer',QuotationSaleController.getCustomer)
Route.post(RouteName+'/addCustomer',QuotationSaleController.addCustomer)
Route.put(RouteName+'/editCustomer/:id',QuotationSaleController.editCustomer)
Route.delete(RouteName+'/deleteCustomer/:id',QuotationSaleController.deleteCustomer)
Route.post(RouteName+'/addBusiness', type, QuotationSaleController.addBusiness)
Route.post(RouteName+'/addQuotationSale', QuotationSaleController.addQuotationSale)
Route.get(RouteName+'/getQuotation',QuotationSaleController.getQuotation)
Route.delete(RouteName+'/deleteQuotation/:id',QuotationSaleController.deleteQuotation)
Route.get(RouteName+'/getBusinessByID/:id',QuotationSaleController.getBusinessByID)
Route.put(RouteName+'/editBusiness/:id', type ,QuotationSaleController.editBusiness)

module.exports = Route