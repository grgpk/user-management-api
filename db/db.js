const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  connnectToDb: (cb) => {
    MongoClient.connect("mongodb://localhost:27017/users")
      .then((client) => {
        dbConnection = client.db();
        cb();
      })
      .catch((err) => {
        console.log(err);
        cb(err);
      });
  },
  getDb: () => dbConnection,
};
