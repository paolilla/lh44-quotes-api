require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect(`mongodb+srv://admin-paola:${process.env.DB_PW}@cluster0.r0xq4kd.mongodb.net/lh44DB`, {useNewUrlParser: true});

const quoteSchema = mongoose.Schema(
  {
  quote: String,
  "tag": String
  },
  {
    versionKey: false
  }
);

const Quote = mongoose.model("Quote", quoteSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.route("/quotes").get(function(req, res){

  Quote.countDocuments().exec(function (err, count) {
    var random = Math.floor(Math.random() * count);
    Quote.findOne().skip(random).exec(
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  });
});

app.route("/quotes/:quoteTag").get(function(req, res){
  const quoteTag = _.capitalize(req.params.quoteTag);
  Quote.countDocuments({tag: quoteTag}).exec(function (err, count) {
    var random = Math.floor(Math.random() * count);
    Quote.findOne({tag: quoteTag}).skip(random).exec(
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});
