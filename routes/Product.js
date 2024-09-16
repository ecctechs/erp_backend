//set route to call API
//ex. if call to working code in getProduct function have to call API http://localhost:5000/product/getProduct
const express = require('express');
const Route = express.Router();
const RouteName = '/product'
const { verifyTokenWithRole } = require('../middleware/verifytokenwithrole'); 

const ProductController = require('../controllers/ProductController');
const { cloudinary } = require('../utils/cloudinary');

const multer = require('multer');
var upload = multer({ dest: 'upload/'});
var type = upload.single('file');

Route.get(RouteName+'/getProduct',ProductController.getProduct)
Route.get(RouteName+'/getProductType',ProductController.getProductType)
Route.post(RouteName+'/getProductByProductType/:id',ProductController.getProductByProductType)
Route.post(RouteName+'/AddProduct', type ,ProductController.AddProduct)
Route.put(RouteName+'/EditProduct/:id', type ,ProductController.EditProduct)
Route.delete(RouteName+'/DeleteProduct/:id',ProductController.DeleteProduct)
Route.post(RouteName+'/AddCategory',ProductController.AddCategory)
Route.put(RouteName+'/EditCategory/:id',ProductController.EditCategory)
Route.delete(RouteName+'/DeleteCategory/:id',ProductController.DeleteCategory)
Route.post(RouteName+'/AddTransaction',ProductController.AddTransaction)
Route.put(RouteName+'/EditTransaction/:id',ProductController.EditTransaction)
Route.post(RouteName+'/AddProductType',ProductController.AddProductType)
Route.delete(RouteName+'/DeleteProductType/:id',ProductController.DeleteProductType)
Route.get(RouteName+'/getCategory',ProductController.getCategory)
Route.get(RouteName+'/getTransaction',ProductController.getTransaction)


module.exports = Route
