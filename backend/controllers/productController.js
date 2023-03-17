import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

/***
 * @desc get all products
 * @route Get /api/products
 * @access public
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

/****
 * @desc Get single products
 * @route Get  /api/products/:id
 * @access public
 */

const getProductsById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 *  @desc		Delete product
 *  @route	Delete /api/users/:id
 * 	@access	private/Admin
 *
 */

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

/**
 *  @desc		create a product
 *  @route	POST /api/prducts/:id
 * 	@access	private/Admin
 *
 */

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample product",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Some desc....",
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

/**
 *  @desc		update product
 *  @route	PUT /api/prducts/:id
 * 	@access	private/Admin
 *
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

/**
 *  @desc		create a new review
 *  @route	PUT /api/prducts/:id
 * 	@access	private
 */
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviews = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviews) {
      res.status(400);
      throw new Error("Product already reveiwed");
    }

    const review = {
      name: req.user._id,
      rating: +rating, //converting string into a number
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce(
      (acc, currVal) => currVal.rating + acc,
      0
    );
    product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductsById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
