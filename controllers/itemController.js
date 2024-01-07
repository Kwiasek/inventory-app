const Item = require("../models/item");
const Category = require("../models/category");

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
  const allCategories = await Category.find({}, "name")
    .sort({ name: 1 })
    .exec();

  res.render("item_form", {
    title: "Create item",
    categories: allCategories,
  });
});

exports.item_create_post = [
  body("name", "Name must not be empty")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be min 3 characters")
    .escape(),
  body("desc").trim().escape(),
  body("price", "Price must be greater than 0")
    .trim()
    .isInt({ min: 1 })
    .escape(),
  body("quantity", "Quantity must be positive number")
    .trim()
    .isInt({ min: 0 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "name");
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      desc: req.body.desc,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
    });

    if (!errors.isEmpty()) {
      res.render("item_form", {
        title: "Create item",
        item: item,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  res.render("item_delete", {
    title: "Delete item",
    item: item,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid).exec();
  res.redirect("/inventory/items");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find({}, "name").sort({ name: 1 }).exec(),
  ]);

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_form", {
    title: "Update item",
    categories: allCategories,
    item: item,
  });
});

exports.item_update_post = [
  body("name", "Name must not be empty")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be min 3 characters")
    .escape(),
  body("desc").trim().escape(),
  body("price", "Price must be greater than 0")
    .trim()
    .isFloat({ min: 1 })
    .escape(),
  body("quantity", "Quantity must be positive number")
    .trim()
    .isInt({ min: 0 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "name");
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      desc: req.body.desc,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("item_form", {
        title: "Update item",
        item: item,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        item,
        {}
      ).exec();
      res.redirect(updatedItem.url);
    }
  }),
];

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
    const result = await Item.find({
      name: { $regex: req.body.search, $options: "i" },
    }).exec();

    res.render("item_search", {
      title: "Search result",
      results: result,
    });
  }),
];
