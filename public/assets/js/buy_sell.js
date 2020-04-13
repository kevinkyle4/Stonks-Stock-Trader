let buyingPower = 1486.75;
let totalPortfolioValue = [];

let portfolio = [];
let buyingPowerDisplay = $("#buyingPowerDisplay").text("$" + buyingPower);

const iexKey = "pk_a5df7586be53494985f04ba9191b5221";

$("#confirmBuy").on("click", () => {
  let parsePrice = JSON.parse(localStorage.getItem("currentPrice"));
  let parseTicker = JSON.parse(localStorage.getItem("currentTicker"));

  let chosenStockPrice = parsePrice.price;
  let chosenStock = parseTicker.ticker;

  console.log(chosenStockPrice, chosenStock);

  if (buyingPower > chosenStockPrice) {
    for (let i = 0; i < portfolio.length; i++) {
      if (portfolio[i].ticker === chosenStock) {
        portfolio[i].sharesOwned++;
        buyingPower -= chosenStockPrice;
        console.log("Updated buying Power: " + buyingPower);
        let portfolioJSON = JSON.stringify(portfolio);
        console.log(portfolioJSON);
        buyingPowerDisplay.text("$" + buyingPower);
        location.reload();
        return;
      }
    }
    buyingPower -= chosenStockPrice;
    buyingPowerDisplay.text("$" + buyingPower);

    // let currentTicker = JSON.parse(localStorage.getItem("currentTicker"));

    stockObject = {
      ticker: chosenStock,
      price: chosenStockPrice,
      //   price: chosenStockPrice,
      sharesOwned: 1,
      marketPrice: chosenStockPrice
    };

    $.ajax("/api/stocks", {
      type: "POST",
      data: stockObject
    }).then(function(response) {
      console.log(response.data);
      console.log(" buy request sent", response.data);
    });

    console.log("stock object", stockObject);

    portfolio.push(stockObject);

    let portfolioJSON = JSON.stringify(portfolio);
    console.log("portfolio: " + portfolioJSON);
    location.reload();
    return;
  } else {
    console.log("Not enough money.");
  }
});

$("#confirmSell").on("click", () => {
  let parsePrice = JSON.parse(localStorage.getItem("currentPrice"));
  let parseTicker = JSON.parse(localStorage.getItem("currentTicker"));
  let chosenStockPrice = parsePrice.price;
  let chosenStock = parseTicker.ticker;

  console.log(chosenStockPrice, chosenStock);

  stockObject = {
    ticker: chosenStock,
    //   price: chosenStockPrice,
    sharesOwned: 1
  };

  console.log("stock object in sell", stockObject);

  $.ajax("/api/sell", {
    type: "POST",
    data: stockObject
  }).then(function(response) {
    console.log(response.data);
    console.log(" sell request sent", stockObject);
  });

  location.reload();
});
