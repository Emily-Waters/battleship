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
    } = await db.query("SELECT name, password AS hashed FROM users WHERE name = $1;", [email.toLowerCase()]);
    bcrypt.compareSync(password, hashed)
      ? res.send({ type: "UPDATE_USER", value: { name } })
      : res.send({ type: "SET_ERROR", value: "Incorrect password" });
  } catch (error) {
    res.send({ type: "SET_ERROR", value: "Incorrect email. Register to play" });
  }
});

module.exports = router;
