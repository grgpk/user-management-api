const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { getDb } = require("../db/db");
const getCount = require("../db/count");

router.get("/", async function (req, res) {
  // current page
  const page = parseInt(req.query.page) || 0;
  const limit = 5;
  let total = await getCount("categories");
  getDb()
    .collection("categories")
    .find()
    .sort()
    .skip(page * limit)
    .limit(limit)
    .toArray()
    .then((categories) => {
      if (categories) {
        res.status(200).json({ categories, total, limit });
      } else {
        res.status(200).json([]);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Cannot fetch categories" });
    });
});

router.post("/add", (req, res) => {
  const category = req.body;

  getDb()
    .collection("categories")
    .insertOne(category)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not add new category" });
    });
});

router.delete("/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    getDb()
      .collection("categories")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not delete the category" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document ID" });
  }
});

router.patch("/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    getDb()
      .collection("categories")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: "Could not update the category", err: err });
      });
  } else {
    res.status(500).json({ error: "Not a valid document ID" });
  }
});

module.exports = router;
