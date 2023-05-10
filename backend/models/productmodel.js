const mongoose = require("mongoose");
const prodectschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product name"],
  },
  discription: {
    type: String,
    required: [true, "Please Enter product discription"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product price"],
  },
  dicount: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  catagory: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    rewuired: true,
    default: 1,
  },
  numberofreviews: {
    type: Number,
    default: 0,
  },
  review: [
    {
      user: {
        type: String,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
    },
  ],
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
});
module.exports = new mongoose.model("Product", prodectschema);
