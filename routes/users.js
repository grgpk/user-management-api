const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { getDb } = require("../db/db");

router.get("/", function (req, res) {
  getDb()
    .collection("users")
    .find()
    .toArray()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: "Cannot fetch users" });
    });
});

router.get("/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    getDb()
      .collection("users")
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not fetch the user" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document ID" });
  }
});

router.post("/add", (req, res) => {
  const user = req.body;

  getDb()
    .collection("users")
    .insertOne(user)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not create new user" });
    });
});

router.delete("/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    getDb()
      .collection("users")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not delete the user" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document ID" });
  }
});

router.patch("/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    getDb()
      .collection("users")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not update the user" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document ID" });
  }
});

module.exports = router;
