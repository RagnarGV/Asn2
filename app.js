var express = require("express");
const fs = require("fs");
var path = require("path");
var app = express();
const exphbs = require("express-handlebars");
const port = process.env.port || 3000;
app.use(express.static(path.join(__dirname, "public")));
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
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});
app.get("/users", function (req, res) {
  res.send("respond with a resource");
});

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
app.get("/data/search/isbn/", (req, res) => {
  res.render("searchISBN");
});
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
          // res.write("\nTitle: " + row.title);
          // res.write("\nAuthor: " + row.author);
          // res.write("\nPrice: " + row.price);
          // res.write("\npages: " + row.avg_reviews);
          // res.write("\navg_reviews: " + row.avg_reviews);
          // res.write("\nn_reviews: " + row.n_reviews);
          // res.write("\nstar: " + row.star);
          // res.write("\ndimensions: " + row.dimensions);
          // res.write("\nweight: " + row.weight);
          // res.write("\nlanguage: " + row.language);
          // res.write("\npublisher: " + row.publisher);
          // res.write("\nISBN_13: " + row.ISBN_13);
          // res.write("\ncomplete_link: " + row.complete_link + "\n");
        }
      });
      // res.end();
    }
  });
});
app.get("/data/search/title/", (req, res) => {
  res.render("searchTitle");
});
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
          // res.write("\nTitle: " + row.title);
          // res.write("\nAuthor: " + row.author);
          // res.write("\nPrice: " + row.price);
          // res.write("\npages: " + row.avg_reviews);
          // res.write("\navg_reviews: " + row.avg_reviews);
          // res.write("\nn_reviews: " + row.n_reviews);
          // res.write("\nstar: " + row.star);
          // res.write("\ndimensions: " + row.dimensions);
          // res.write("\nweight: " + row.weight);
          // res.write("\nlanguage: " + row.language);
          // res.write("\npublisher: " + row.publisher);
          // res.write("\nISBN_13: " + row.ISBN_13);
          // res.write("\ncomplete_link: " + row.complete_link + "\n");
        }
      });
      res.render("searchTitleResult", {
        title: "Search Result for " + title,
        content: contents,
      });
      console.log(contents);
      // res.end();
    }
  });
});
app.get("*", function (req, res) {
  res.render("error", { title: "Error", message: "Wrong Route" });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
