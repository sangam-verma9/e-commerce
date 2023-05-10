const express = require("express");
const {
  getAllProduct,
  createprodect,
  updateproduct,
  deleteproduct,
  getproductdetails,
  getsangam,
  createReview,
  getAllreviews,
  deleteReview,
  getAllProducthome,
} = require("../controllers/productControl");
const { isAuthUser, authRole } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProduct);
router.route("/products/home").get(getAllProducthome);
router.route("/sangam").get(getsangam);
router
  .route("/admin/products/new")
  .post(isAuthUser, authRole("admin"), createprodect);
router
  .route("/admin/products/:id")
  .put(isAuthUser, authRole("admin"), updateproduct);
router.route("/products/:id").get(getproductdetails);
router
  .route("/admin/products/:id")
  .delete(isAuthUser, authRole("admin"), deleteproduct);
router
  .route("/review")
  .put(isAuthUser, createReview)
  .get(getAllreviews)
  .delete(isAuthUser, deleteReview);

module.exports = router;
