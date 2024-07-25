require('dotenv').config();

const express =require('express');
const expressLayout= require('express-ejs-layouts');

const app=express();
const port=5000 ||  process.env.port;

app.use(express.static('public'));

//templating engine 
app.use(expressLayout);
app.set('layout ','./layouts/main');
app.set('view engine ','ejs');

 app.use('/',require('./server/routes/main'));
 

app.listen(port,()=>{
    console.log('app listening on port ${5000}') ;

});
