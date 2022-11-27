const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { getDb } = require("../db/db");

router.get("/", function (req, res) {
  // current page
  const page = req.query.page || 0;
  const usersPerPage = 2;
  getDb()
    .collection("categories")
    .find()
    .sort()
    .skip(page * usersPerPage)
    .limit(usersPerPage)
    .toArray()
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      res.status(500).json({ error: "Cannot fetch categories" });
    });
});

router.get("/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    getDb()
      .collection("categories")
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not fetch the category" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document ID" });
  }
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

router.put("/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    getDb()
      .collection("categories")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not update the category" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document ID" });
  }
});

module.exports = router;
