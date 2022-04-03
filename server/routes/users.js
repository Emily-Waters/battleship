const express = require("express");

const db = require("../db/index");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM users");
    console.log(data);
  } catch (error) {
    throw error;
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const {
      rows: [{ name, hashed }],
    } = await db.query("SELECT name, password AS hashed FROM users WHERE email = $1;", [email.toLowerCase()]);
    bcrypt.compareSync(password, hashed)
      ? res.send({ type: "SET_USER", value: { name } })
      : res.send({ type: "SET_ERROR", value: "Incorrect password" });
  } catch (error) {
    res.send({ type: "SET_ERROR", value: "Incorrect email. Register to play" });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  try {
    const {
      rows: [{ name }],
    } = await db.query("INSERT INTO users (name,email,password) VALUES($1,$2,$3) RETURNING name;", [
      username,
      email.toLowerCase(),
      hashedPassword,
    ]);

    console.log(name);

    res.send({ type: "SET_USER", value: { name } });
  } catch (error) {
    console.log(error);
    res.send({ type: "SET_ERROR", value: "That email has already been registered" });
  }
});

module.exports = router;
