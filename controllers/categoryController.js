const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [itemsCount, categoriesCount] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Inventory app",
    items: itemsCount,
    categories: categoriesCount,
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
    title: "Categories list",
    categories: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, itemsFromCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name desc url").exec(),
  ]);

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
    .isLength({ min: 3, max: 300 })
    .withMessage("Description must be longer than 3 characters")
    .withMessage("Description accepts max 300 characters.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const category = await Category.find({ name: req.body.name }).exec();
    const errors = validationResult(req);

    if (category.length != 0) {
      res.redirect(category.url);
      return;
    }

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
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_delete", {
    title: "Delete category",
    category: category,
    items: itemsInCategory,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.body.categoryid).exec(),
    Item.find({ category: req.body.categoryid }).exec(),
  ]);
  if (itemsInCategory.length > 0) {
    res.render("category_delete", {
      title: "Delete category",
      items: itemsInCategory,
      category: category,
    });
  } else {
    await Category.findByIdAndDelete(req.body.categoryid).exec();
    res.redirect("/inventory/categories");
  }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Create category",
    category: category,
  });
});

exports.category_update_post = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be longer than 3 characters.")
    .escape(),
  body("desc")
    .trim()
    .isLength({ min: 3, max: 300 })
    .withMessage("Description must be longer than 3 characters")
    .withMessage("Description accepts max 300 characters.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      desc: req.body.desc,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      res.redirect(updatedCategory.url);
    }
  }),
];
