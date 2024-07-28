const express = require('express');
const router = express.Router();
const UserModel = require('../models/user')

router.get('/', (req, res) => {
  const locals = {
    title: "blog",
    description: "blog application post and comments on articles",
  };
  res.render('index.ejs');
});

router.get('/users', (req, res) => {
  const locals = {
    title: "blog",
    description: "blog application post and comments on articles",
  };
  res.render('index');
});

router.get('/about', (req, res) => {
  res.render('about.ejs');
});

router.get('/register', (req, res) => {
  res.render('register.ejs');
});
router.get('/login', (req, res) => {
  res.render('login.ejs');
});

router.post('/api/register', async (req, res) => {
  console.log(req.body);
  const user = new UserModel(req.body);
  await user.save()

  res.json(user)
});

router.post('/api/login', async (req, res) => {
  console.log(req.body);
  const user = await UserModel.findOne(req.body);
  if (!user) {
    const message = encodeURIComponent("Invalid user or password")
    return res.redirect('/login?message=' + message)
  }

  res.json(user)
});

module.exports = router;
