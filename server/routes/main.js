const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const UserModel = require("../models/user");
const { PostModel } = require("../models/post");
const { JSDOM } = require("jsdom");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

router.get("/", async (req, res) => {
  const isLoggedIn = !!req.session?.user;
  console.log(req.session?.user);
  const posts = await PostModel.find()
    .populate("userId")
    .populate({ path: "comments", populate: { path: "userId" } })
    .sort({ createdAt: -1 });
  console.log(posts[0].comments);
  console.log(posts);
  res.render("index.ejs", {
    name: req.session?.user?.fullName ?? "",
    posts,
    isLoggedIn,
  });
});

router.get("/users", (req, res) => {
  const locals = {
    title: "blog",
    description: "blog application post and comments on articles",
  };
  res.render("index");
});

router.get("/about", (req, res) => {
  res.render("about.ejs");
});

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post("/api/register", async (req, res) => {
  console.log(req.body);
  const hashedPassword = await hashPassword(req.body.password);
  console.log({ hashedPassword });
  const user = new UserModel({ ...req.body, password: hashedPassword });
  await user.save();

  res.redirect("/login ");
});

router.post("/api/login", async (req, res) => {
  console.log(req.body);
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    const message = encodeURIComponent("Invalid email");
    return res.redirect("/login?message=" + message);
  }

  console.log(user);
  console.log(req.body.password, user.password);
  const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!isValidPassword) {
    const message = encodeURIComponent("Invalid email or password");
    return res.redirect("/login?message=" + message);
  }

  req.session.user = user;

  res.redirect("/");
});

router.post("/api/status", async (req, res) => {
  const { status } = req.body;

  await PostModel.create({ status, userId: req.session.user._id });

  res.redirect("/");
});

router.post("/api/status/:statusId/comment", async (req, res) => {
  const { statusId } = req.params;
  const { comment: commentText } = req.body;

  await PostModel.findByIdAndUpdate(statusId, {
    $push: { comments: { text: commentText, userId: req.session.user._id } },
  });

  res.redirect("/");
});

router.post("/api/status/:statusId/likes", async (req, res) => {
  const post = await PostModel.findById(req.params.statusId);
  const { action } = req.body;
  const userId = req.session.user._id;

  if (action === "like") {
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((u) => u !== userId);
    } else {
      post.likes.push(userId);
    }
  }

  await post.save();
  res.json({ message: "success" });
});

module.exports = router;
