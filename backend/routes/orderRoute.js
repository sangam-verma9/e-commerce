const express = require("express");
const { isAuthUser } = require("../middleware/auth");
const {
  neworder,
  getorderdetails,
  myorders,
  getallorders,
  updateorder,
  delereorder,
} = require("../controllers/orderControl");
const { authRole } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAuthUser, neworder);
router.route("/order/me").get(isAuthUser, myorders);
router.route("/admin/orders").get(isAuthUser, authRole("admin"), getallorders);
router.route("/order/:id").get(isAuthUser, getorderdetails);
router.route("/order/:id").get(isAuthUser, getorderdetails);
router
  .route("/admin/order/:id")
  .put(isAuthUser, authRole("admin"), updateorder)
  .delete(isAuthUser, authRole("admin"), delereorder);
module.exports = router;
