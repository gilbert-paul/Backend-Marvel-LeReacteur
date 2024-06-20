const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { skip, limit, name } = req.query;
    let skipper = "";
    let limiter = "";
    let namer = "";
    if (skip) {
      skipper = `&skip=${skip}`;
    }
    if (limit) {
      limiter = `&limit=${limit}`;
    }
    if (name) {
      const newName = name.split(" (")[0];

      namer = `&name=${newName}`;
    }
    await axios
      .get(
        `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API}${limiter}${skipper}${namer}`
      )
      .then((response) => {
        res.status(202).json({ data: response.data });
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  } catch (error) {
    return res.status(500).json({ message: "Error DB" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await axios
      .get(
        `https://lereacteur-marvel-api.herokuapp.com/character/${id}?apiKey=${process.env.MARVEL_API}`
      )
      .then((response) => {
        res.status(202).json({ data: response.data });
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  } catch (error) {
    return res.status(500).json({ message: "Error DB" });
  }
});

module.exports = router;
