const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { skip, limit, title } = req.query;
    let skipper = "";
    let limiter = "";
    let titler = "";
    if (skip) {
      skipper = `&skip=${skip}`;
    }
    if (limit) {
      limiter = `&limit=${limit}`;
    }

    if (title) {
      const newTitle = title.split("(")[0];

      titler = `&title=${newTitle}`;
    }
    await axios
      .get(
        `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API}${limiter}${skipper}${titler}`
      )
      .then((response) => {
        res.status(201).json({ data: response.data });
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  } catch (error) {
    return res.status(500).json({ message: "Error DB" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await axios
      .get(
        `https://lereacteur-marvel-api.herokuapp.com/comic/${id}?apiKey=${process.env.MARVEL_API}`
      )
      .then((response) => {
        res.status(201).json({ data: response.data });
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  } catch (error) {
    return res.status(500).json({ message: "Error DB" });
  }
});

module.exports = router;
