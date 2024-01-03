#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

// const Book = require("./models/book");
// const Author = require("./models/author");
// const Genre = require("./models/genre");
// const BookInstance = require("./models/bookinstance");

const Item = require("./models/item");
const Category = require("./models/category");

// const genres = [];
// const authors = [];
// const books = [];
// const bookinstances = [];

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  //   await createGenres();
  //   await createAuthors();
  //   await createBooks();
  //   await createBookInstances();
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
// async function genreCreate(index, name) {
//   const genre = new Genre({ name: name });
//   await genre.save();
//   genres[index] = genre;
//   console.log(`Added genre: ${name}`);
// }

// async function createGenres() {
//   console.log("Adding genres");
//   await Promise.all([
//     genreCreate(0, "Fantasy"),
//     genreCreate(1, "Science Fiction"),
//     genreCreate(2, "French Poetry"),
//   ]);
// }

async function categoryCreate(index, name, desc) {
  const category = new Category({
    name: name,
    desc: desc,
  });
  await category.save();
  categories[index] = category;
  console.log(`Added category ${name}`);
}

async function itemCreate(index, name, desc, price, category) {
  const item = new Item({
    name: name,
    desc: desc,
    price: price,
    category: category,
  });
  await item.save();
  items[index] = item;
  console.log(`Added item ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Shirts",
      "Shirt Section: This category encompasses a diverse range of shirts, including T-shirts, dress shirts, and casual tops."
    ),
    categoryCreate(
      1,
      "Pants",
      "Pants Section: Dive into the inventory of trousers, jeans, and other bottoms within this section."
    ),
    categoryCreate(
      2,
      "Shoes",
      "Shoe Section: Explore a comprehensive assortment of footwear, covering sneakers, boots, formal shoes, and more."
    ),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      "Classic Cotton Tee",
      "Essential comfort meets timeless style with our Classic Cotton Tee. Crafted from high-quality cotton, this versatile shirt is perfect for everyday wear. Available in various colors and sizes, it's a wardrobe staple for casual occasions.",
      19.99,
      categories[0]
    ),
    itemCreate(
      1,
      "Graphic Print Adventure Tee",
      "Make a statement with our Graphic Print Adventure Tee. Featuring unique and vibrant designs, this shirt is perfect for those who love to express their personality. The soft and breathable fabric ensures comfort, while the bold graphics add a touch of flair.",
      24.99,
      categories[0]
    ),
    itemCreate(
      2,
      "Premium Polo Shirt",
      "Elevate your casual style with our Premium Polo Shirt. Made from a blend of premium fabrics, this shirt exudes sophistication. Ideal for a smart-casual look, it offers a refined appearance without compromising on comfort.",
      29.99,
      categories[0]
    ),
    itemCreate(
      3,
      "Athletic Performance Sneakers",
      "Unleash your full potential with our Athletic Performance Sneakers. Engineered for comfort and support, these sneakers are designed for active individuals. Whether you're hitting the gym or enjoying a jog, these shoes provide the perfect blend of style and functionality.",
      49.99,
      categories[2]
    ),
    itemCreate(
      4,
      "Classic Leather Loafers",
      "Step into timeless elegance with our Classic Leather Loafers. Crafted from genuine leather, these loafers exude sophistication and style. Ideal for formal occasions or adding a polished touch to your everyday look, these shoes are a must-have in every wardrobe.",
      69.99,
      categories[2]
    ),
    itemCreate(
      5,
      "Trendy High-Top Boots",
      "Embrace urban style with our Trendy High-Top Boots. Designed for fashion-forward individuals, these boots combine comfort with a bold aesthetic. The high-top design provides ankle support, making them perfect for both casual and edgy looks.",
      79.99,
      categories[2]
    ),
    itemCreate(
      6,
      "Slim Fit Denim Jeans",
      "Achieve a modern and tailored look with our Slim Fit Denim Jeans. These jeans feature a contemporary slim cut that flatters your silhouette. Crafted from durable denim, they are both stylish and comfortable for all-day wear.",
      39.99,
      categories[1]
    ),
    itemCreate(
      7,
      "Cargo Adventure Pants",
      "Gear up for any adventure with our Cargo Adventure Pants. Equipped with multiple pockets for convenience, these pants are not only practical but also stylish. The durable fabric ensures they can withstand the rigors of outdoor activities.",
      44.99,
      categories[1]
    ),
    itemCreate(
      8,
      "Tailored Dress Trousers",
      "Make a statement in the boardroom or at formal events with our Tailored Dress Trousers. These trousers are meticulously crafted for a sleek and professional look. The versatile design allows them to seamlessly transition from office to evening occasions.",
      54.99,
      categories[1]
    ),
  ]);
}
