const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/css', express.static(path.join(__dirname, './frontend/css')));
app.set('view', path.join(__dirname, 'views'));


require('./backend/controllers/rotasController')(app);

module.exports = app;