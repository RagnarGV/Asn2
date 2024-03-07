//all required packages
//• Add the following declaration at the top of .js files
/******************************************************************************
 * ITE5315 – Assignment 2
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Gaurav Hariyani Student ID: N01579426 Date: 03/05/2023
 *
 *
 ******************************************************************************/
var express = require("express");
const fs = require("fs");
var path = require("path");
var app = express();
const exphbs = require("express-handlebars");
const port = process.env.port || 3000; //port specified
app.use(express.static(path.join(__dirname, "public"))); //default public path
//template engine with helpers
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      modifyAvgReviews: function (avg_reviews) {
        if (avg_reviews == "") {
          avg_reviews = "N/A";
        }
        return avg_reviews;
      },
    },
  })
);
//setting template engine
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//calling index view
app.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});
//normal users route
app.get("/users", function (req, res) {
  res.send("respond with a resource");
});
//calling data view to show title
app.get("/data", function (req, res) {
  let myData = path.join(__dirname, "public", "datasetA.json");

  fs.readFile(myData, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.send("Error reading JSON file");
    } else {
      // Parse the JSON data
      let contacts = JSON.parse(data);
      console.log(contacts);
      res.render("data", {
        title: "JSON data is loaded and ready!",
      });
    }
  });
});
//displaying all data using allData view
app.get("/allData", function (req, res) {
  let myData = path.join(__dirname, "public", "datasetA.json");

  fs.readFile(myData, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.send("Error reading JSON file");
    } else {
      // Parse the JSON data
      let contacts = JSON.parse(data);
      console.log(contacts);
      res.render("allData", {
        title: "JSON data is loaded and ready!",
        content: contacts,
      });
    }
  });
});
//displaying isbn data using dataIndex view
app.get("/data/isbn/:index", (req, res) => {
  let myData = path.join(__dirname, "public", "datasetA.json");

  fs.readFile(myData, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.send("Error reading JSON file");
    } else {
      // Parse the JSON data
      let contacts = JSON.parse(data);
      console.log(req.params.index);

      let index = req.params.index;
      let contactsDteails = contacts[index];
      console.log(contactsDteails);
      if (parseInt(req.params.index) > 830) {
        res.render("data", {
          title: "ISBN not found, Please enter a valid ISBN.",
        });
      } else {
        res.render("dataIndex", {
          title: "JSON data is loaded and ready!",
          content: contactsDteails,
        });
      }
    }
  });
});
//displaying search result form isbn data using searchIsbn view
app.get("/data/search/isbn/", (req, res) => {
  res.render("searchISBN");
});
//displaying search result isbn data using searchIsbnResult view
app.post("/data/search/isbn/", (req, res) => {
  let myData = path.join(__dirname, "public", "datasetA.json");

  fs.readFile(myData, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.send("Error reading JSON file");
    } else {
      // Parse the JSON data
      let contacts = JSON.parse(data);

      let isbn = req.body.isbn;
      contacts.forEach((row) => {
        let book_isbn = row.ISBN_13;
        if (book_isbn == isbn) {
          res.render("searchIsbnResult", {
            title: "Search Result for " + isbn,
            content: row,
          });
        }
      });
    }
  });
});
//displaying search result title data form using searchTitle view
app.get("/data/search/title/", (req, res) => {
  res.render("searchTitle");
});
//displaying search result title data using searchTitleResult view
app.post("/data/search/title/", (req, res) => {
  let myData = path.join(__dirname, "public", "datasetA.json");
  fs.readFile(myData, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.send("Error reading JSON file");
    } else {
      // Parse the JSON data
      let contacts = JSON.parse(data);
      var contents = [];
      let title = req.body.title;
      contacts.forEach((row) => {
        let book_title = row.title;
        if (book_title.includes(title)) {
          contents.push(row);
        }
      });
      res.render("searchTitleResult", {
        title: "Search Result for " + title,
        content: contents,
      });
      console.log(contents);
    }
  });
});
//displaying errors on wrong path/route

app.get("*", function (req, res) {
  res.render("error", { title: "Error", message: "Wrong Route" });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
