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
      encrypt: true,
      rowCollectionOnDone: true,
      rowCollectionOnRequestCompletion: true
    }
  };
  var connection = new Connection(config);
  return connection;
}

async function query(qstring, uname, pass, serv, db) {
  var results = [];
  var connection = connect(
    uname,
    pass,
    serv,
    db
  );

  connection.on("connect", async function(err) {
    if (err) {
      console.log(err);
    } else {
      return new Promise(function(resolve, reject) {
        results = queryDatabase(qstring, connection);
        resolve(results);
        console.log(results);
      });
    }
  });
}
/*
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
  return results;
}
*/

/*
function queryDatabase(qstring, connection) {
  var request = new Request(qstring, function(err, rowCount, rows) {
    if (err) {
      console.log(err);
    } else {
      console.log(rowCount + " rows");
    }
    console.log(rows); // this is the full array of row objects
    // it just needs some manipulating

    jsonArray = [];
    rows.forEach(function(columns) {
      var rowObject = {};
      columns.forEach(function(column) {
        rowObject[column.metadata.colName] = column.value;
      });
      jsonArray.push(rowObject);
    });
    console.log(jsonArray);
  });
  connection.execSql(request);
}
*/
/*
function queryDatabase(qstring, connection) {
  let results = [];
  let request = new Request(qstring, function(err, rowCount, rows) {
    console.log(rowCount + " row(s) returned");
    return results;
  });

  request.on("row", function(columns) {
    let row = [];
    columns.forEach(function(column) {
      row.push(column.value);
    });
    results.push(row);
  });

  request.on("requestCompleted", function() {});

  connection.execSql(request);
}
*/
/*
async function queryDatabase(qstring, connection) {
  const results = [];
  return await new Promise((resolve, reject) => {
    const request = new Request(qstring, function(err, rowCount) {
      if (err) {
        return reject(err);
      } else {
        console.log(rowCount + " rows");
      }
    });

    request.on("row", function(columns) {
      let row = [];
      columns.forEach(function(column) {
        row.push(column.value);
      });
      results.push(row);
    });

    request.on("doneProc", function(rowCount, more, returnStatus, rows) {
      console.log("onDoneProc");

      console.log("all rows", results);

      return resolve(results);
    });

    connection.execSql(request);
  });
}
*/

async function queryDatabase(qstring, uname, pass, serv, db) {
  var dbConn = connect(
    uname,
    pass,
    serv,
    db
  ); // Here add your connection code in connect() function
  const allRows = [];
  return await new Promise((resolve, reject) => {
    const request = new Request(qstring, function(err, rowCount) {
      if (err) {
        return reject(err);
      } else {
        console.log(rowCount + " rows");
      }
    });

    request.on("row", function(columns) {
      columns.forEach(function(column) {
        const row = [];
        row.push({
          metadata: column.metadata,
          value: column.value,
          toString: () => column.value
        });
        allRows.push(row);
      });
    });

    request.on("doneProc", function(rowCount, more, returnStatus, rows) {
      console.log("onDoneProc");

      console.log("all rows", allRows);

      return resolve(allRows);
    });

    dbConn.execSql(request);
  });
}

module.exports.query = query;
