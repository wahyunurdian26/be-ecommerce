import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModels.js";

export const CreateOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cardItem } = req.body;

  if (!cardItem || cardItem.length < 1) {
    res.status(400);
    throw new Error("keranjang masih kosong");
  }
  let orderItem = [];
  let total = 0;

  for (const cart of cardItem) {
    const productData = await Product.findOne({ _id: cart.product });
    if (!productData) {
      res.status(404);
      throw new Error("id product tidak ditemukan");
    }
    const { name, price, _id } = productData;
    const singleProduct = {
      quantity: cart.quantity,
      name,
      price,
      product: _id,
    };

    orderItem = [...orderItem, singleProduct];

    total += cart.quantity * price;
  }

  const order = await Order.create({
    itemsDetail: orderItem,
    total,
    firstName,
    lastName,
    email,
    phone,
    user: req.user.id,
  });

  return res.status(201).json({
    total,
    order,
    message: "Berhasil buat Order product",
  });
});

export const AllOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  return res.status(201).json({
    data: orders,
    message: "Berhasil tampil semua Order product",
  });
});

export const DetailOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  return res.status(201).json({
    data: order,
    message: "Berhasil tampil detail Order product",
  });
});

export const CurrentUserOrder = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user.id });
  return res.status(201).json({
    data: order,
    message: "Berhasil tampil current user Order product",
  });
});
