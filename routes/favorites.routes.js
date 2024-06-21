const express = require("express");
const router = express.Router();
const axios = require("axios");
const Favorite = require("../models/Favorite.js");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const User = require("../models/User.js");

router.post("/add", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const thisUser = await User.findById(user._id);
    const { title, description, image, type, id } = req.body;
    if (!title || !image || !type || !id) {
      return res.status(404).json({ message: "Item not found" });
    }
    const alreadyFavorite = await Favorite.find({ id: id, owner: user });
    if (alreadyFavorite.length > 0) {
      return res.status(201).json({ message: "Already Added" });
    }
    const newFavorite = new Favorite({
      title: title,
      description: description,
      image: image,
      type: type,
      id: id,
      owner: user,
    });
    await newFavorite.save();
    return res.status(201).json(newFavorite);
  } catch (error) {
    return res.status(500).json({ message: "Error DB" });
  }
});
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const title = req.query.title;
    const thisFavorite = { owner: user };
    if (title) {
      const regExpTitle = new RegExp(title, "ig");
      thisFavorite.title = regExpTitle;
    }

    const allFavorites = await Favorite.find(thisFavorite);
    res.status(200).json({ data: allFavorites });
  } catch (error) {
    return res.status(500).json({ message: "Error DB" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    try {
      const thisFavorite = await Favorite.findById(id).populate("comics");
      res.status(200).json({ data: thisFavorite });
    } catch (error) {
      res.status(400).json({ message: "Favorite not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error DB" });
  }
});

module.exports = router;
