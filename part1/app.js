const express = require('express');
const app = express();
const db = require('./db');
const dogsApi = require('./api');

app.use(express.json());
app.use('/', dogsApi);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
