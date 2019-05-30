var Connection = require("tedious").Connection;
var Request = require("tedious").Request;

function connect(uname, pass, serv, db) {
  var config = {
    authentication: {
      options: {
        userName: uname, // update me
        password: pass // update me
      },
      type: "default"
    },
    server: serv, // update me
    options: {
      database: db, //update me
      encrypt: true
    }
  };
  var connection = new Connection(config);
  return connection;
}

function query(qstring, uname, pass, serv, db) {
  var results = [];
  var connection = connect(
    uname,
    pass,
    serv,
    db
  );

  connection.on("connect", function(err) {
    if (err) {
      console.log(err);
    } else {
      results = queryDatabase(qstring, connection);
    }
  });
  return results;
}

function queryDatabase(qstring, connection) {
  var results = [];
  var request = new Request(qstring, function(err, rowCount, rows) {
    console.log(rowCount + " row(s) returned");
  });

  request.on("row", function(columns) {
    columns.forEach(function(column) {
      results.push(column);
    });
  });
  connection.execSql(request);
}

module.exports.query = query;
