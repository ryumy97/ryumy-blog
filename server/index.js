const path = require('path');
const express = require("express");
var cors = require('cors')

const routes = require('./routes');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors())

app.use(express.static(path.resolve(__dirname, '../build')));

app.use("/", routes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});