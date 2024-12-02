const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const poolConfig = {
  connectionLimit: 2,
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'learning_db',
};
let pool = mysql.createPool(poolConfig);

const webserver = express();
const port = 7380;

webserver.use(bodyParser.text({}));
webserver.use(express.static(path.resolve(__dirname, 'public')));

webserver.post('/', (req, res) => {
  pool.getConnection((err, connection) => {
    try {
      connection.query(`${req.body};`, (error, results) => {
        if (error) {
          res.status(500).send(error);
          connection.release();
        } else {
          console.log('results', results[0]);
          res.send(results);
        }
      });
    } catch (err) {
      res.status(500).end();
      connection.release();
    }
  });
});

webserver.listen(port, () => console.log('webserver running on port ' + port));
