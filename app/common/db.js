//модуль для рабоыт с sqlite
var Sqlite = require("nativescript-sqlite");

var db;

  new Sqlite("labels.db", (err, connect) => {
    db = connect;
  });

  module.exports = db;
