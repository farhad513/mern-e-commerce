const {
  registerController,
  loginController,
  forgotPasswordController,
  updateProfileController,
  getOrderController,
} = require("../controllers/authController");
const { requireSignin, isAdmin } = require("../middleware/authMiddleware");

const router = require("express").Router();

// auth Register
router.post("/register", registerController);

// auth Login
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

// router
// router.get("/test", requireSignin, isAdmin, testController);

// procted  user routes
router.get("/user-auth", requireSignin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});
// procted  admin routes
router.get("/admin-auth", requireSignin, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// update profile
router.put("/profile/update", requireSignin, updateProfileController);

// orders
router.get("/orders", requireSignin, getOrderController);
module.exports = router;
