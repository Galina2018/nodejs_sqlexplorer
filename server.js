const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'learning_db',
};

const webserver = express();
const port = 7380;

// webserver.use(bodyParser.json());
webserver.use(bodyParser.text({}));
webserver.use(express.static(path.resolve(__dirname, 'public')));

webserver.post('/', (req, res) => {
  try {
    connection = mysql.createConnection(connectionConfig);
    connection.connect();
    connection.query(`${req.body};`, (error, results, fields) => {
      if (error) {
        res
          .status(500)
          .send(error)
          .end();
      } else {
        res.send(results);
      }
      connection.end();
    });
  } catch (error) {
    res.status(500).end();
    if (connection) connection.end();
  }
});

webserver.listen(port, () => console.log('webserver running on port ' + port));
