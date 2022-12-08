const express = require("express");
const router = express.Router();
const { getDb } = require("../db/db");

router.get("/", async (req, res) => {
  try {
    const categories = await getDb().collection("categories").find().toArray();
    const statuses = await getDb().collection("userStatuses").find().toArray();
    res.status(200).json({ statuses, categories });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
