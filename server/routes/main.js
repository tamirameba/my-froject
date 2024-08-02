const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const UserModel = require('../models/user');
const { PostModel } = require('../models/post');


async function hashPassword(password) {
  const salt = await bcrypt.genSalt()
  const hashed = await bcrypt.hash(password, salt)
  return hashed
}

router.get('/', async (req, res) => {




  console.log(req.session?.user)
  res.render('index.ejs', {
    name: req.session?.user?.fullName ?? '',
    posts: req.session?.user ? await PostModel.find() : [],
    isLoggedIn: !!req.session?.user
  });
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
  const hashedPassword = await hashPassword(req.body.password);
  console.log({ hashedPassword })
  const user = new UserModel({ ...req.body, password: hashedPassword });
  await user.save()

  res.redirect('/login')
});

router.post('/api/login', async (req, res) => {
  console.log(req.body);
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    const message = encodeURIComponent("Invalid email")
    return res.redirect('/login?message=' + message)
  }

  console.log(user)
  console.log(req.body.password, user.password)
  const isValidPassword = bcrypt.compareSync(req.body.password, user.password)
  if (!isValidPassword) {
    const message = encodeURIComponent("Invalid email or password")
    return res.redirect('/login?message=' + message)
  }

  req.session.user = user;

  res.redirect('/')
});

module.exports = router;
