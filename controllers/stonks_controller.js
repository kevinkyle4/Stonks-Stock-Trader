let express = require("express");
const contactsJSON = require("../ticker.json");
let router = express.Router();
// For the default version
const algoliasearch = require("algoliasearch");
// Use Handlebars to render the main index.html page with the plans in it.

const stocksModel = require("../models/stock_models.js");

const client = algoliasearch("UHTZT2IPPH", "df4a490c648060820ac5d9a98920db23");
const index = client.initIndex("nasdaq-ticker");

router.get("/", (req, res) => {
  stocksModel.selectAll(data => {
    let hbsObject = {
      stock: data
    };

    res.render("index", hbsObject);
    console.log(hbsObject);
  });
});

// Buy logic
//POST user input/new stock
router.post("/api/stocks", (req, res) => {
  stocksModel.selectAll(data => {
    let foundMatch = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i].ticker === req.body.ticker) {
        let currentShares = data[i].sharesOwned;
        currentShares++;

        stocksModel.update([currentShares], [req.body.ticker], function(
          results
        ) {
          console.log(results);
        });

        foundMatch = true;
      }
    }

    if (!foundMatch) {
      console.log("hit else~!");
      stocksModel.insert(
        [
          req.body.ticker,
          req.body.sharesOwned,
          req.body.price,
          req.body.marketPrice
        ],
        function(result) {}
      );
      console.log("stocks model", stocksModel);
    }
  });
});

//Sell logic

router.post("/api/sell", (req, res) => {
  stocksModel.selectAll(data => {
    console.log("data", data);

    for (let i = 0; i < data.length; i++) {
      if (data[i].ticker === req.body.ticker) {
        let currentShares = data[i].sharesOwned;
        currentShares--;
        console.log("current shares", currentShares);

        stocksModel.update([currentShares], [req.body.ticker], function(
          results
        ) {
          console.log(results);
        });
      }
    }
  });
});

// total portfolio value

router.get("/api/total", (req, res) => {
  stocksModel.total(data => {
    console.log("data", data);
    let hbsObject = {
      stock: data
    };
    console.log("hbs object data", hbsObject);

    marketValueEmpty = [];

    hbsObject.stock.forEach(element => {
      currentPrice = element.currentPrice;
      numberOfShares = element.sharesOwned;

      marketValueIndividual = numberOfShares * currentPrice;
      marketValueEmpty.push(marketValueIndividual);
      console.log("marketValueIndividual", marketValueIndividual);
    });

    console.log("marketValueEmpty", marketValueEmpty);

    function getSum(total, num) {
      return total + num;
    }

    portfolioValue = marketValueEmpty.reduce(getSum, 0);

    console.log("portfolioValue", portfolioValue);
    rounderPortfolioValue = portfolioValue.toFixed(2);

    res.json(rounderPortfolioValue);
  });
});

module.exports = router;
