const express=require('express');
const Router=express.Router();

  

//routers

Router.use()

 Router.get('/users',(req,res) => {

   const locals={
       title:"blog",
       description:"blog application post and comments on articles",
   };
    res.render('index');
  });

Router.get('/about', (req,res) => {
    res.render('about');
});
  
module.express=express.Router;
