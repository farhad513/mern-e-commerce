const { default: slugify } = require("slugify");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const fs = require("fs");
const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, stock, shipping } =
      req.fields;
    const { image } = req.files;
    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required" });
      case !description:
        return res.status(500).send({ message: "Description is required" });
      case !price:
        return res.status(500).send({ message: "price is required" });
      case !category:
        return res.status(500).send({ message: "category is required" });
      case !stock:
        return res.status(500).send({ message: "stock is required" });
      case image && image.size > 1000000:
        return res.status(500).send({ message: "image is required" });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (image) {
      products.image.data = fs.readFileSync(image.path);
      products.image.contentType = image.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in createing Product",
    });
  }
};

// get All Product
const getProductController = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .populate("category")
      .select("-image")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(201).send({
      success: true,
      message: "Get All Products",
      totalProduct: product.length,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "get all products Error",
    });
  }
};
// get Single Product Controller

const getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel
      .findOne({ slug })
      .select("-image")
      .populate("category");
    res.status(201).send({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Get Single Product Error Controller",
    });
  }
};

// get product Image Controller

const productImageController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.image)
      .select("image");
    if (product.image.data) {
      res.set("Content-type", product.image.contentType);
      return res.status(200).send(product.image.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while product Image",
      error,
    });
  }
};

// delete Product Controler

const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    await productModel.findByIdAndDelete(id).select("-image");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error Product Delete Controller",
      error,
    });
  }
};

// update Product Controller

const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, stock, shipping } =
      req.fields;

    const { image } = req.files;
    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required" });
      case !description:
        return res.status(500).send({ message: "Description is required" });
      case !price:
        return res.status(500).send({ message: "price is required" });
      case !category:
        return res.status(500).send({ message: "category is required" });
      case !stock:
        return res.status(500).send({ message: "stock is required" });
      case image && image.size > 1000000:
        return res.status(500).send({ message: "image is required" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (image) {
      products.image.data = fs.readFileSync(image.path);
      products.image.contentType = image.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Update Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update Product",
    });
  }
};

// filter Product Controller

const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Filtering Product",
      error,
    });
  }
};

// product count controller

const productCountController = async (req, res) => {
  try {
    const count = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Product count controller error",
      error,
      success: false,
    });
  }
};
// produt count controller

const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-image")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Product List controller error",
      error,
      success: false,
    });
  }
};
// search product controller

const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          {
            name: { $regex: keyword, $options: "i" },
          },
          {
            description: { $regex: keyword, $options: "i" },
          },
        ],
      })
      .select("-image");
    // console.log(results);
    res.json({ results });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Product Search controller error",
      error,
      success: false,
    });
  }
};

// related product controller
const relatedProductController = async (req, res) => {
  console.log(req.params);
  try {
    const { pId, cId } = req.params;
    const products = await productModel
      .find({
        category: cId,
        _id: { $ne: pId },
      })
      .select("-image")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Smiller Product  controller error",
      error,
    });
  }
};

// product category controller
const productCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Product category controller error",
      error,
    });
  }
};
module.exports = {
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
  relatedProductController,
  productCategoryController,
};
