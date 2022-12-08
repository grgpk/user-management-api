const { getDb } = require("./db");

function getCount(collection) {
  return getDb().collection(collection).countDocuments();
}

module.exports = getCount;
