const router = require("express").Router();
const {
  createCategoryController,
  updateCategory,
  allCategoryController,
  categoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");
const { requireSignin, isAdmin } = require("../middleware/authMiddleware");
router.post(
  "/create-category",
  requireSignin,
  isAdmin,
  createCategoryController
);

// update Cateogoy
router.put("/update-category/:id", requireSignin, isAdmin, updateCategory);

// get all category
router.get("/all-category", allCategoryController);

// Singl  category
router.get("/single-category/:slug", categoryController);

// Delete  category
router.delete(
  "/delete-category/:id",
  requireSignin,
  isAdmin,
  deleteCategoryController
);

module.exports = router;
