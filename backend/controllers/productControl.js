const Product = require("../models/productmodel");
const Errorhandler = require("../utils/erroehandler");
const catchasyncerror = require("../middleware/catchAsyncError");
const Apifeature = require("../utils/apifeatures");

// create product admin only
exports.createprodect = catchasyncerror(async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});
exports.getsangam = catchasyncerror(async (req, res) => {
  res.send("hello sangam");
});

exports.getAllProducthome = catchasyncerror(async (req, res, next) => {
  const resultperpage = 9;
  const apifeature = new Apifeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultperpage);
  const products = await apifeature.query;
  // const products = await Product.find();
  res.status(200).json({ products });
});
exports.getAllProduct = catchasyncerror(async (req, res, next) => {
  const apifeature = new Apifeature(Product.find(), req.query)
    .search()
    .filter();

  const products = await apifeature.query;
  // const products = await Product.find();
  res.status(200).json({ products });
});

// update product only admin
exports.updateproduct = catchasyncerror(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Successfully updated",
    product,
  });
});
// get product details
exports.getproductdetails = catchasyncerror(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  res.status(200).json({
    product,
  });
});
//delete product
exports.deleteproduct = catchasyncerror(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  // if (!product) {
  //   return res.status(500).json({
  //     success: false,
  //     message: "product not found",
  //   });
  // }

  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});

// create review
exports.createReview = catchasyncerror(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isreviewed = product.review.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isreviewed) {
    product.review.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.review.push(review);
    product.numberofreviews = product.review.length;
  }
  let avg = 0;
  product.ratings = product.review.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.review.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// get all reviews of a product
exports.getAllreviews = catchasyncerror(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new Errorhandler("product not found", 400));
  }
  res.status(200).json({
    success: true,
    review: product.review,
  });
});

// delete review of a product
exports.deleteReview = catchasyncerror(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  const reviews = product.review.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;
  const numberofreviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      review: reviews,
      ratings,
      numberofreviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
