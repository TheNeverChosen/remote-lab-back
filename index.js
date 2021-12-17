const env = require('./utils/env');
const express = require('express');
require('express-async-errors');
const app = express();
const port = env.APP_PORT || 3333;

const router = require('./routes/router');
const errorHandler = require('./middlewares/error');

app.use(express.json()); //parse application/json body

app.use(router); //setting all routes

app.use((req, res)=>{
  res.status(404).send('Nothing Found');
});

app.use(errorHandler); //Custom Error Handler

app.listen(port, () => { //Starting server
  console.log(`App listening at http://localhost:${port}`)
});