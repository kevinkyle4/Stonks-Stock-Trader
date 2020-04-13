const connection = require("../config/connection.js");

function printQuestionMarks(num) {
  let arr = [];
  for (let i = 0; i < num; i++) {
    arr.push("?");
  }
  return arr.toString();
}

let orm = {
  selectAll: function(table, cb) {
    let queryString = "SELECT * FROM " + table + ";";
    connection.query(queryString, function(err, res) {
      if (err) throw err;
      cb(res);
    });
  },
  total: function(table, cb) {
    // select a, b, (a*b) as c from table
    let queryString =
      "select 0 as TotalRow, sharesOwned, currentPrice,(sharesOwned*currentPrice) as Result from " +
      table +
      "UNION ALL select 1 as TotalRow, Sum(sharesOwned) as sharesOwned, Sum(currentPrice) as currentPrice, Sum(sharesOwned*currentPrice) as Result from" +
      table +
      ";";
    connection.query(queryString, function(err, res) {
      if (err) throw err;
      cb(res);
    });
    console.log(queryString);
    console.log(res);
  },
  insert: function(vals, cb) {
    // let queryString = "INSERT INTO " + table;
    // queryString += " (";
    // queryString += cols.toString();
    // queryString += ") ";
    // queryString += "VALUES (";
    // queryString += printQuestionMarks(vals.length);
    // queryString += ") ";

    let queryString =
      "INSERT INTO stocks (ticker, sharesOwned, buyPrice, currentPrice) VALUES (?, ?, ?, ?)";
    // console.log(queryString);
    connection.query(queryString, vals, (err, result) => {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },

  update: function(updateShares, updateTicker, cb) {
    let queryString =
      "UPDATE stocks" +
      " SET sharesOwned = " +
      updateShares +
      " WHERE ticker = '" +
      updateTicker +
      "';";
    connection.query(queryString, function(err, res) {
      if (err) throw err;
      cb(res);
    });
  }
};

//       delete:
//   }

module.exports = orm;
