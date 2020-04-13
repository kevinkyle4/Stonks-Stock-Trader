//Search

// Replace with your own values
const searchClient = algoliasearch(
  "FRJVR4E6Y4",
  "c85d022bc27816c31277cfc57bc250ff" // search only API key, not admin API key
);

const search = instantsearch({
  indexName: "stocks_project",
  searchClient,
  routing: true
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#search-box",
    placeholder: "Search for stock (ex: MSFT)"
  })
]);

search.addWidgets([
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item: `<div class="stock">{{ Symbol }}</div>`,
      empty: `We didn't find any results for the search <em>"{{query}}"</em>`
    }
  })
]);

function fetchData(val, page) {
  return index
    .search(val, { hitsPerPage: 10, page: page })
    .then(function(content) {
      // do what you want with the content
      console.log(content);
    })
    .catch(function(err) {
      console.error(err);
    });
}

// let queryString = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker.toUpperCase()}&apikey=${apikey}`;

$("#hits").on("click", ".ais-Hits-item", function(event) {
  console.log("CLICKED");
  event.stopPropagation();
  event.stopImmediatePropagation();

  let ticker = $(this)[0].innerText;
  const apikey = "42E1XDPFEW98SC5T";
  let queryString = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker.toUpperCase()}&apikey=${apikey}`;

  // https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo

  $.ajax(queryString, {
    method: "GET",
    url: queryString
  }).then(response => {
    console.log("ticker: ", ticker);

    console.log(response);
    let currentStockPrice = response["Global Quote"]["05. price"];
    let currentPercentChange = response["Global Quote"]["10. change percent"];
    let currentCompanyName = response["Global Quote"]["01. symbol"];
    $("#tickerHTML").text(currentCompanyName);
    $("#stockPriceHTML").text("$" + currentStockPrice);
    $("#percentChange").text(currentPercentChange + " TODAY");
    if (currentPercentChange[0] == "-") {
      $("#percentChange").attr("style", "color: red");
    } else {
      $("#percentChange").attr("style", "color: green");
    }
    $("#companyNameHTML").text("$");
    localStorage.setItem("currentTicker", JSON.stringify({ ticker: ticker }));
    localStorage.setItem(
      "currentPrice",
      JSON.stringify({ price: currentStockPrice })
    );

    let intradayValues = [];
    let intradayRange = [];
    let intradayRangeSliced = [];

    function getDaily() {
      //ajax request
      const queryURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${apikey}`;
      $.ajax({
        url: queryURL,
        method: "GET",
        dataType: "json",
        contentType: "application/json"
      })
        .then(function(data) {
          let timeSeries = data["Time Series (5min)"];
          for (let key in timeSeries) {
            let value = timeSeries[key];
            let openValue = value["4. close"];
            intradayValues.push(openValue);
          }
          for (let key in timeSeries) {
            intradayRange.push(key);
          }

          for (let i = 0; i < intradayRange.length; i++) {
            intradayRangeSliced.push(intradayRange[i].slice(5, 16));
          }
        })
        .then(function(results) {
          createIntradayChart(intradayValues, intradayRangeSliced);
        });
    }

    getDaily();

    function createIntradayChart(openValues, dateRangeWeek) {
      let ctx = document.getElementById("myChart2").getContext("2d");
      let myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dateRangeWeek.reverse(),
          datasets: [
            {
              label: "Intraday (5 Min Interval)",
              data: openValues.reverse(),
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              fill: false,
              borderColor: ["rgba(255, 99, 132, 1)"],
              borderWidth: 3
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: false,
                  callback: function(value, index, values) {
                    return "$" + value;
                  }
                }
              }
            ]
          }
        }
      });
    }
  });
});

$(".tickerButton").on("click", function(event) {
  console.log("CLICKED");
  event.stopPropagation();
  event.stopImmediatePropagation();
  let subStr = $(this)[0].innerText;
  let ticker = subStr.substr(0, 4);
  const apikey = "42E1XDPFEW98SC5T";
  let queryString = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker.toUpperCase()}&apikey=${apikey}`;

  $.ajax(queryString, {
    method: "GET",
    url: queryString
  }).then(response => {
    console.log("ticker: ", ticker);

    console.log(response);
    let currentStockPrice = response["Global Quote"]["05. price"];
    let currentPercentChange = response["Global Quote"]["10. change percent"];
    let currentCompanyName = response["Global Quote"]["01. symbol"];
    $("#tickerHTML").text(currentCompanyName);
    $("#stockPriceHTML").text("$" + currentStockPrice);
    $("#percentChange").text(currentPercentChange + " TODAY");
    if (currentPercentChange[0] == "-") {
      $("#percentChange").attr("style", "color: red");
    } else {
      $("#percentChange").attr("style", "color: green");
    }
    $("#companyNameHTML").text("$");
    localStorage.setItem("currentTicker", JSON.stringify({ ticker: ticker }));
    localStorage.setItem(
      "currentPrice",
      JSON.stringify({ price: currentStockPrice })
    );

    let intradayValues = [];
    let intradayRange = [];
    let intradayRangeSliced = [];

    function getDaily() {
      //ajax request
      const queryURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${apikey}`;
      $.ajax({
        url: queryURL,
        method: "GET",
        dataType: "json",
        contentType: "application/json"
      })
        .then(function(data) {
          let timeSeries = data["Time Series (5min)"];
          for (let key in timeSeries) {
            let value = timeSeries[key];
            let openValue = value["4. close"];
            intradayValues.push(openValue);
          }
          for (let key in timeSeries) {
            intradayRange.push(key);
          }

          for (let i = 0; i < intradayRange.length; i++) {
            intradayRangeSliced.push(intradayRange[i].slice(5, 16));
          }
        })
        .then(function(results) {
          createIntradayChart(intradayValues, intradayRangeSliced);
        });
    }

    getDaily();

    function createIntradayChart(openValues, dateRangeWeek) {
      let ctx = document.getElementById("myChart2").getContext("2d");
      let myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dateRangeWeek.reverse(),
          datasets: [
            {
              label: "Intraday (5 Min Interval)",
              data: openValues.reverse(),
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              fill: false,
              borderColor: ["rgba(255, 99, 132, 1)"],
              borderWidth: 3
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: false,
                  callback: function(value, index, values) {
                    return "$" + value;
                  }
                }
              }
            ]
          }
        }
      });
    }
  });
});

window.onload = function(){  
  let ticker = "TSLA"
  const apikey = "42E1XDPFEW98SC5T";
  let queryString = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker.toUpperCase()}&apikey=${apikey}`;

  $.ajax(queryString, {
    method: "GET",
    url: queryString
  }).then(response => {
    console.log("ticker: ", ticker);

    console.log(response);
    let currentStockPrice = response["Global Quote"]["05. price"];
    let currentPercentChange = response["Global Quote"]["10. change percent"];
    let currentCompanyName = response["Global Quote"]["01. symbol"];
    $("#tickerHTML").text(currentCompanyName);
    $("#stockPriceHTML").text("$" + currentStockPrice);
    $("#percentChange").text(currentPercentChange + " TODAY");
    if (currentPercentChange[0] == "-") {
      $("#percentChange").attr("style", "color: red");
    } else {
      $("#percentChange").attr("style", "color: green");
    }
    $("#companyNameHTML").text("$");
    localStorage.setItem("currentTicker", JSON.stringify({ ticker: ticker }));
    localStorage.setItem(
      "currentPrice",
      JSON.stringify({ price: currentStockPrice })
    );

    let intradayValues = [];
    let intradayRange = [];
    let intradayRangeSliced = [];

    function getDaily() {
      //ajax request
      const queryURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${apikey}`;
      $.ajax({
        url: queryURL,
        method: "GET",
        dataType: "json",
        contentType: "application/json"
      })
        .then(function(data) {
          let timeSeries = data["Time Series (5min)"];
          for (let key in timeSeries) {
            let value = timeSeries[key];
            let openValue = value["4. close"];
            intradayValues.push(openValue);
          }
          for (let key in timeSeries) {
            intradayRange.push(key);
          }

          for (let i = 0; i < intradayRange.length; i++) {
            intradayRangeSliced.push(intradayRange[i].slice(5, 16));
          }
        })
        .then(function(results) {
          createIntradayChart(intradayValues, intradayRangeSliced);
        });
    }

    getDaily();

    function createIntradayChart(openValues, dateRangeWeek) {
      let ctx = document.getElementById("myChart2").getContext("2d");
      let myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dateRangeWeek.reverse(),
          datasets: [
            {
              label: "Intraday (5 Min Interval)",
              data: openValues.reverse(),
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              fill: false,
              borderColor: ["rgba(255, 99, 132, 1)"],
              borderWidth: 3
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: false,
                  callback: function(value, index, values) {
                    return "$" + value;
                  }
                }
              }
            ]
          }
        }
      });
    }
  });
};




// Total market value

const currentAPI = "https://damp-beyond-37195.herokuapp.com/api/total";

function totalMarketValue() {
  $.ajax({
    url: currentAPI,
    method: "GET",
    dataType: "json",
    contentType: "application/json"
  }).then(function(data) {
    console.log(data);
    $("#portfolioValueDisplay").html("$" + data);
  });
}

totalMarketValue();

search.start();
