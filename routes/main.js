const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const UserModel = require("../server/models/user");
const { PostModel } = require("../server/models/post");

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
    isAdmin: isAdmin(req),
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
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

router.get("/admin", async (req, res) => {
  if (!isAdmin(req)) {
    return res.redirect("/");
  }
  const users = await UserModel.find();
  res.render("admin.ejs", {
    users,
  });
});

router.get("/register", (req, res) => {
  res.render("register.ejs");
});
router.get("/forgot", (req, res) => {
  res.render("forgot.ejs");
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

  res.redirect("/login");
});

router.post("/api/forgot", async (req, res) => {
  console.log(req.body);
  const hashedPassword = await hashPassword(req.body.password);
  const updatedUser = await UserModel.findOneAndUpdate(
    { email: req.body.email },
    { password: hashedPassword },
    {
      new: true,
    }
  );
  if (!updatedUser) {
    const message = encodeURIComponent("Invalid email");
    return res.redirect("/forgot?message=" + message);
  }

  res.redirect("/login");
});

router.delete("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;
  await UserModel.findByIdAndDelete(userId);
  res.sendStatus(200);
});
router.delete("/api/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  await PostModel.findByIdAndDelete(postId);
  res.sendStatus(200);
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

  console.log({ post, action, userId });
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

function isAdmin(req) {
  return process.env.ADMIN === req.session?.user?.email;
}
