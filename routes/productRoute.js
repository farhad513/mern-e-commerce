const router = require("express").Router();
const formidable = require("express-formidable");
const {
  createProductController,
  getProductController,
  getSingleProductController,
  productImageController,
  deleteProductController,
  updateProductController,
  filterProductController,
  productCountController,
  productListController,
  searchProductController,
  productCategoryController,
  relatedProductController,
} = require("../controllers/productController");
const { requireSignin, isAdmin } = require("../middleware/authMiddleware");
// create Product
router.post(
  "/create-product",
  requireSignin,
  isAdmin,
  formidable(),
  createProductController
);
// update Product
router.put(
  "/update-product/:id",
  requireSignin,
  isAdmin,
  formidable(),
  updateProductController
);
// get Product
router.get("/get-product", getProductController);

// get Single Product
router.get("/single-product/:slug", getSingleProductController);

// get image
router.get("/product-image/:image", productImageController);

// delete Product
router.delete(
  "/delete-product/:id",
  requireSignin,
  isAdmin,
  deleteProductController
);

//  Product Filter
router.post("/product-filter", filterProductController);

// product count
router.get("/product-count", productCountController);

// product list controller
router.get("/product-list/:page", productListController);

// product Search controller
router.get("/search/:keyword", searchProductController);
// related product  controller
router.get("/related-product/:pId/:cId", relatedProductController);

// product base category
router.get("/product-category/:slug", productCategoryController);

module.exports = router;
