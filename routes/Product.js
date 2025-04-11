const express = require("express");
const Route = express.Router();
const RouteName = "/product";
const {
  verifyTokenWithRole,
  verifyTokenWithbusiness_id,
} = require("../middleware/verifytokenwithrole");

const ProductController = require("../controllers/ProductController");
const { cloudinary } = require("../utils/cloudinary");

const multer = require("multer");
var upload = multer({ dest: "upload/" });
var type = upload.single("file");

Route.get(
  RouteName + "/getProduct",
  verifyTokenWithbusiness_id,
  ProductController.getProduct
);
Route.get(RouteName + "/getProductType", ProductController.getProductType);
Route.post(
  RouteName + "/getProductByProductType/:id",
  verifyTokenWithbusiness_id,
  ProductController.getProductByProductType
);
Route.post(
  RouteName + "/AddProduct",
  type,
  verifyTokenWithbusiness_id,
  ProductController.AddProduct
);
Route.put(RouteName + "/EditProduct/:id", type, ProductController.EditProduct);
Route.delete(RouteName + "/DeleteProduct/:id", ProductController.DeleteProduct);
Route.post(
  RouteName + "/AddCategory",
  verifyTokenWithbusiness_id,
  ProductController.AddCategory
);
Route.put(RouteName + "/EditCategory/:id", ProductController.EditCategory);
Route.delete(
  RouteName + "/DeleteCategory/:id",
  verifyTokenWithbusiness_id,
  ProductController.DeleteCategory
);
Route.post(RouteName + "/AddTransaction", ProductController.AddTransaction);
Route.put(
  RouteName + "/EditTransaction/:id",
  ProductController.EditTransaction
);
Route.post(RouteName + "/AddProductType", ProductController.AddProductType);
Route.delete(
  RouteName + "/DeleteProductType/:id",
  ProductController.DeleteProductType
);
Route.get(
  RouteName + "/getCategory",
  verifyTokenWithbusiness_id,
  ProductController.getCategory
);
Route.get(
  RouteName + "/getTransaction",
  verifyTokenWithbusiness_id,
  ProductController.getTransaction
);

module.exports = Route;
