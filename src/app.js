const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const session = require('express-session')

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/css', express.static(path.join(__dirname, './frontend/css')));
app.set('views', path.join(__dirname, './../views'));


require('./backend/controllers/rotasController')(app);

module.exports = app;