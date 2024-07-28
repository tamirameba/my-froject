require('dotenv').config();
const path = require('path');
const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./server/config/db');


const app = express();
const port = 5000 || process.env.port;

//connect to DB
connectDB();


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//templating engine 
app.set('view engine ', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))
app.set('layout', path.join(__dirname, 'views', 'layout.ejs'))
app.use(expressLayout);

app.use('/', require('./server/routes/main'));


app.listen(port, () => {
    console.log('app listening on port ${5000}');

});
