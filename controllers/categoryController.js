const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  res.render("index", {
    title: "Inventory app home",
  });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  if (allCategories === null) {
    const err = new Error("Categories not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_list", {
    title: "Category List",
    categories: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, itemsFromCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name desc url").exec(),
  ]);

  console.log(itemsFromCategory);
  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category detail",
    category: category,
    items: itemsFromCategory,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", {
    title: "Create category",
  });
});

exports.category_create_post = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be longer than 3 characters.")
    .escape(),
  body("desc")
    .trim()
    .isLength({ max: 300 })
    .withMessage("Description accepts max 300 characters.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const category = await Category.find({ name: req.body.name }).exec();
    const errors = validationResult(req);

    console.log(category);

    const newCategory = new Category({
      name: req.body.name,
      desc: req.body.desc,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create category",
        category: newCategory,
        errors: errors.array(),
      });
      return;
    } else {
      await newCategory.save();
      res.redirect(newCategory.url);
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Get category delete");
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post category delete");
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Get category update");
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post category update");
});
