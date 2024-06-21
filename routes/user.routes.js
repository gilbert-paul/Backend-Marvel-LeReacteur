const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("../models/User");

router.post("/signup", fileUpload(), async (req, res) => {
  try {
    const { mail, username, password } = req.body;
    if (!mail || !username || !password) {
      return res
        .status(400)
        .json({ message: "You need to complete mail, username & password" });
    }
    const mailAlreadyUsed = await User.findOne({mail:mail})
    if(mailAlreadyUsed){
      return res
      .status(400)
      .json({ message: "Mail already used" });
  }
    
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(20);
    const newUser = new User({
      mail: mail,
      username: username,
      salt: salt,
      hash: hash,
      token: token,
    });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: "Error DB" });
  }
});
router.get("/login", fileUpload(), async (req, res) => {
  try {
    const { mail, password } = req.query;
    const thisUser = await User.find({ mail: mail });
    if (!thisUser[0]) {
      return res.status(400).json({ message: "Mail or password invalid" });
    }
    const hash = SHA256(password + thisUser[0].salt).toString(encBase64);
    if (hash !== thisUser[0].hash) {
      return res.status(400).json({ message: "Mail or password invalid" });
    }
    return res.status(202).json({
      username: thisUser[0].username,
      token: thisUser[0].token,
      mail: thisUser[0].mail,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error DB" });
  }
});

module.exports = router;
