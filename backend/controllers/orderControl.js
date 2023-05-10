const Order = require("../models/orderModel");
const Product = require("../models/productmodel");
const Errorhandler = require("../utils/erroehandler");
const catchasyncerror = require("../middleware/catchAsyncError");

// crete new order
exports.neworder = catchasyncerror(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// get single order details
exports.getorderdetails = catchasyncerror(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  //.populate("user", "name email");
  if (!order) {
    next(new Errorhandler("order is not found with this id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

//get login user orsers
exports.myorders = catchasyncerror(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all order --admin
exports.getallorders = catchasyncerror(async (req, res, next) => {
  const order = await Order.find();

  let totalamount = 0;
  order.forEach((tamount) => {
    totalamount += tamount.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalamount,
    order,
  });
});

async function updatestock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;

  await product.save({ valdateBeforeSave: false });
}
//update order admin
exports.updateorder = catchasyncerror(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    next(new Errorhandler("order not found", 404));
  }

  if (order.orderStatus === "Delivered") {
    next(new Errorhandler("product has been already delivered"), 400);
  }
  order.orderItems.forEach(async (item) => {
    await updatestock(item.product, item.quantity);
  });

  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ valdateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// delete order --admin
exports.delereorder = catchasyncerror(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    next(new Errorhandler("order not found", 404));
  }
  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});
