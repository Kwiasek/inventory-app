const Item = require("../models/item");
const Category = require("../models/item");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.items_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().exec();

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
  const result = await Item.find({ name: req.body.search }).exec();
  res.render("item_search", { title: "Search results", results: result });
});

exports.item_search_post = [
  body("search", "Request must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const result = await Item.find({ name: req.body.search }).exec();
    console.log(result);
    res.render("item_search", {
      title: "Search result",
      results: result,
    });
  }),
];
