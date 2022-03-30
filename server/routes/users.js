const express = require("express");
const db = require("../db/index");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  db.query(`SELECT id, username AS name, avatar_url AS avatar FROM users;`).then(({ rows: users }) => {
    const updatedUsers = users.map((user) => {
      return { ...user, room_id: null, channel_id: null };
    });
    res.json(updatedUsers);
  });
});

module.exports = router;
