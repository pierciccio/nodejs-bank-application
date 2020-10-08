const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const user_routes = require('./routes/user');
const card_routes = require('./routes/card');

app.use(bodyParser.urlencoded({ extended: false} ));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

app.use('/api', user_routes);
app.use('/api', card_routes);


module.exports = app;