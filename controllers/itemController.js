const Item = require("../models/item");
const Category = require("../models/item");

const asyncHandler = require("express-async-handler");

exports.items_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().exec();

  console.log(allItems);
  if (allItems === null) {
    const err = new Error("Items not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_list", {
    title: "Items list",
    items: allItems,
  });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    title: "Item detail",
    item: item,
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Get item create");
});

exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post item create");
});

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Get item delete");
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post item delete");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Get item update");
});

exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post item update");
});

exports.item_search_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Get item search");
});

exports.item_search_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post item search");
});
