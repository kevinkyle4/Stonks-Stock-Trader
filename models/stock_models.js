let orm = require("../config/orm.js");

let stockModel = {
  selectAll: function(cb) {
    orm.selectAll("stocks", function(res) {
      cb(res);
    });
  },

  insert: function(vals, cb) {
    orm.insert(vals, function(res) {
      cb(res);
    });
  },

  update: function(updateShares, updateTicker, cb) {
    orm.update(updateShares, updateTicker, function(res) {
      cb(res);
    });
  },
  total: function(cb) {
    orm.selectAll("stocks", function(res) {
      cb(res);
    });
  }
};

module.exports = stockModel;
